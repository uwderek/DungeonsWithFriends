import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import { Store } from 'tinybase';
import { useStore } from 'tinybase/ui-react';
import { AppSidebar, HamburgerButton } from '@/shared/ui/navigation/app-sidebar';
import { CharacterGrid, CharacterGridItem } from './character-grid';
import { PlayableSheetPanel } from './playable-sheet-panel';
import { exportStoreToJson } from '@/shared/store/export-import';
import { createCharacterSheet, getCharacterSheets } from '@/features/character/model/character-sheet-store';
import { getSystemTemplates } from '@/features/creator/model/system-template-store';

export const CharactersScreen: React.FC<{ 
  onNavigate?: (id: string) => void;
  onSettingsPress?: () => void;
  viewportWidth?: number;
  store?: Store;
}> = ({ onNavigate, onSettingsPress, viewportWidth, store }) => {
  const { width: measuredWidth } = useWindowDimensions();
  const providerStore = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [revision, setRevision] = useState(0);
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [exportJson, setExportJson] = useState<string | null>(null);

  const width = viewportWidth ?? measuredWidth;
  const isDesktop = width >= 768;
  const activeStore = store ?? providerStore;
  const sheets = activeStore ? getCharacterSheets(activeStore) : [];
  const templates = activeStore ? getSystemTemplates(activeStore) : [];
  const selectedSheet = sheets.find((sheet) => sheet.character_sheet_id === selectedSheetId) ?? sheets[0] ?? null;
  void revision;

  const characters: CharacterGridItem[] = sheets.map((sheet) => {
    const template = templates.find((item) => item.system_template_id === sheet.system_template_id);
    const fieldCount = Object.keys(sheet.field_values).length;

    return {
      id: sheet.character_sheet_id,
      name: sheet.character_name,
      subtitle: template?.system_name ?? 'Local template',
      detail: `${fieldCount} local fields`,
    };
  });

  const refreshLocalState = () => {
    setRevision((value) => value + 1);
  };

  const handleCreateCharacter = () => {
    if (!activeStore) {
      return;
    }

    const sheet = createCharacterSheet(activeStore, {
      character_name: `Local Hero ${sheets.length + 1}`,
    });
    setSelectedSheetId(sheet.character_sheet_id);
    setExportJson(null);
    refreshLocalState();
  };

  const handleExportCharacters = () => {
    if (!activeStore) {
      return;
    }

    setExportJson(exportStoreToJson(activeStore));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Sidebar - Desktop always visible, Mobile in modal */}
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeId="characters"
          onNavigate={onNavigate}
        />

        {/* Main Content */}
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              height: 56,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#312E81'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {!isDesktop && (
                <HamburgerButton onPress={() => setSidebarOpen(true)} />
              )}
              <Text style={{ fontSize: 14, color: '#6B7280', letterSpacing: 0.5 }}>
                Characters
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                testID="settings-button"
                accessibilityRole="button"
                onPress={() => {
                  if (onSettingsPress) {
                    onSettingsPress();
                  } else {
                    console.log('Settings clicked');
                  }
                }}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: '#1E1B4B',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#312E81'
                }}
              >
                <Settings size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ maxWidth: 1200, alignSelf: 'center', width: '100%' }}>
              {/* Page Title */}
              <Text
                style={{
                  fontFamily: 'Cinzel',
                  fontSize: 28,
                  fontWeight: '700',
                  color: '#D97706',
                  marginBottom: 24
                }}
              >
                All Characters
              </Text>

              <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 12, marginBottom: 20 }}>
                <TouchableOpacity
                  testID="create-character-button"
                  accessibilityRole="button"
                  onPress={handleCreateCharacter}
                  disabled={!activeStore}
                  style={{
                    alignSelf: 'flex-start',
                    borderRadius: 6,
                    backgroundColor: activeStore ? '#D97706' : '#6B7280',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
                    New Local Character
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID="export-characters-button"
                  accessibilityRole="button"
                  onPress={handleExportCharacters}
                  disabled={!activeStore}
                  style={{
                    alignSelf: 'flex-start',
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#312E81',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
                    Export JSON
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Main Content Layout */}
              <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 32 }}>
                {/* Left Column - All Characters */}
                <View style={{ flex: 1 }}>
                  {characters.length > 0 ? (
                    <CharacterGrid
                      characters={characters}
                      title="Local Characters"
                      onCharacterPress={setSelectedSheetId}
                    />
                  ) : (
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: '#312E81',
                        borderRadius: 8,
                        padding: 20,
                        backgroundColor: '#0F172A',
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 18, marginBottom: 8 }}>
                        No local characters yet
                      </Text>
                      <Text style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 16 }}>
                        Create a starter character from the local Fantasy d20 template.
                      </Text>
                      <TouchableOpacity
                        accessibilityRole="button"
                        onPress={handleCreateCharacter}
                        style={{
                          alignSelf: 'flex-start',
                          borderRadius: 6,
                          backgroundColor: '#D97706',
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                        }}
                      >
                        <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
                          Create Local Character
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Right Column - Local playable sheet */}
                {isDesktop && (
                  <View style={{ width: 256 }}>
                    {activeStore && selectedSheet ? (
                      <PlayableSheetPanel
                        store={activeStore}
                        characterSheetId={selectedSheet.character_sheet_id}
                        onChange={refreshLocalState}
                      />
                    ) : (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#312E81',
                          borderRadius: 8,
                          padding: 16,
                          backgroundColor: '#0F172A',
                        }}
                      >
                        <Text style={{ fontFamily: 'Cinzel', fontSize: 16, color: '#FFFFFF', fontWeight: '700', marginBottom: 8 }}>
                          Playable Sheet
                        </Text>
                        <Text style={{ color: '#9CA3AF', fontSize: 13 }}>
                          Create a character to start local play.
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {!isDesktop && activeStore && selectedSheet && (
                <View style={{ marginTop: 24 }}>
                  <PlayableSheetPanel
                    store={activeStore}
                    characterSheetId={selectedSheet.character_sheet_id}
                    onChange={refreshLocalState}
                  />
                </View>
              )}

              {exportJson && (
                <View
                  style={{
                    marginTop: 24,
                    borderWidth: 1,
                    borderColor: '#312E81',
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: '#0F172A',
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: 8 }}>
                    Manual Export
                  </Text>
                  <Text testID="export-preview" style={{ color: '#9CA3AF', fontSize: 12 }} numberOfLines={12}>
                    {exportJson}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
