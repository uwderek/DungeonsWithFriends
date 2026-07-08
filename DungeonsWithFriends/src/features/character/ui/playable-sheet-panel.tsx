import React, { useState } from 'react';
import { Store } from 'tinybase';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import {
    PlayableSheetField,
    PlayableSheetRuntimeError,
    resolvePlayableSheet,
    updatePlayableFieldValue,
} from '@/features/character/model/playable-sheet-runtime';
import {
    createDiceRoll,
    DiceRollStoreError,
    getLatestDiceRollForCharacter,
} from '@/features/character/model/dice-roll-store';

interface PlayableSheetPanelProps {
    store: Store;
    characterSheetId?: string | null;
    onChange?: () => void;
    rollRandom?: () => number;
}

const formatFieldValue = (value: PlayableSheetField['value']): string => (
    value === undefined ? '' : String(value)
);

export const PlayableSheetPanel: React.FC<PlayableSheetPanelProps> = ({ store, characterSheetId, onChange, rollRandom }) => {
    const [revision, setRevision] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [diceNotation, setDiceNotation] = useState('d20');
    const [diceError, setDiceError] = useState<string | null>(null);
    void revision;

    if (!characterSheetId) {
        return null;
    }

    let runtime;
    try {
        runtime = resolvePlayableSheet(store, characterSheetId);
    } catch (runtimeError) {
        return (
            <View style={{ borderWidth: 1, borderColor: '#312E81', borderRadius: 8, padding: 16, backgroundColor: '#0F172A' }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Playable Sheet</Text>
                <Text style={{ color: '#F87171', marginTop: 8 }}>
                    {runtimeError instanceof Error ? runtimeError.message : 'Playable sheet could not be loaded.'}
                </Text>
            </View>
        );
    }

    const refresh = () => {
        setRevision((value) => value + 1);
        onChange?.();
    };

    const handleFieldChange = (field: PlayableSheetField, rawValue: string | boolean) => {
        try {
            updatePlayableFieldValue(store, characterSheetId, field.field_id, rawValue);
            setError(null);
            refresh();
        } catch (updateError) {
            setError(updateError instanceof PlayableSheetRuntimeError
                ? 'Value does not match field type.'
                : 'Field could not be updated.');
        }
    };

    const handleRollDice = () => {
        try {
            createDiceRoll(store, {
                character_sheet_id: characterSheetId,
                notation: diceNotation,
                random: rollRandom,
            });
            setDiceError(null);
            refresh();
        } catch (rollError) {
            setDiceError(rollError instanceof DiceRollStoreError
                ? 'Dice notation is invalid.'
                : 'Roll could not be resolved.');
        }
    };

    const latestRoll = getLatestDiceRollForCharacter(store, characterSheetId);

    return (
        <View style={{ borderWidth: 1, borderColor: '#312E81', borderRadius: 8, padding: 16, backgroundColor: '#0F172A' }}>
            <Text style={{ fontFamily: 'Cinzel', fontSize: 16, color: '#FFFFFF', fontWeight: '700', marginBottom: 4 }}>
                Playable Sheet
            </Text>
            <Text style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 12 }}>
                {runtime.sheet.character_name} - {runtime.systemTemplate.system_name}
            </Text>

            <View style={{ gap: 10 }}>
                {runtime.fields.map((field) => (
                    <View key={field.field_id}>
                        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 4 }}>
                            {field.label}
                        </Text>
                        {field.data_type === 'boolean' ? (
                            <TouchableOpacity
                                testID={`field-toggle-${field.field_id}`}
                                accessibilityRole="button"
                                onPress={() => handleFieldChange(field, !(field.value === true))}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#312E81',
                                    borderRadius: 6,
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                }}
                            >
                                <Text style={{ color: '#FFFFFF' }}>
                                    {field.value === true ? 'True' : 'False'}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TextInput
                                testID={`field-input-${field.field_id}`}
                                value={formatFieldValue(field.value)}
                                onChangeText={(value) => handleFieldChange(field, value)}
                                keyboardType={field.data_type === 'number' ? 'numeric' : 'default'}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#312E81',
                                    borderRadius: 6,
                                    color: '#FFFFFF',
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                }}
                            />
                        )}
                    </View>
                ))}
            </View>

            {runtime.staleBindingIds.length > 0 && (
                <Text style={{ color: '#FBBF24', fontSize: 12, marginTop: 12 }}>
                    {runtime.staleBindingIds.length} stale binding needs creator attention.
                </Text>
            )}

            <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: '#312E81', paddingTop: 12 }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: 6 }}>
                    Local Dice
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                        testID="dice-notation-input"
                        value={diceNotation}
                        onChangeText={setDiceNotation}
                        autoCapitalize="none"
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#312E81',
                            borderRadius: 6,
                            color: '#FFFFFF',
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                        }}
                    />
                    <TouchableOpacity
                        testID="roll-dice-button"
                        accessibilityRole="button"
                        onPress={handleRollDice}
                        style={{
                            borderRadius: 6,
                            backgroundColor: '#D97706',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                            Roll
                        </Text>
                    </TouchableOpacity>
                </View>
                {latestRoll && (
                    <Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8 }}>
                        Rolled {latestRoll.notation}: {latestRoll.total}
                    </Text>
                )}
                {diceError && (
                    <Text style={{ color: '#F87171', fontSize: 12, marginTop: 8 }}>
                        {diceError}
                    </Text>
                )}
            </View>

            {error && (
                <Text style={{ color: '#F87171', fontSize: 12, marginTop: 12 }}>
                    {error}
                </Text>
            )}
        </View>
    );
};
