import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/shared/providers/auth-provider';
import { CampaignCard } from '@/features/campaign/ui/campaign-card';
import { CharacterCard } from '@/features/character/ui/character-card';
import { StoryCard } from '@/features/story/ui/story-card';
import { LogOut, PlusCircle, Settings, Swords, Users } from 'lucide-react-native';

export const DashboardScreen: React.FC = () => {
    const { logout, user, offlineMode } = useAuth();

    // Mock Data
    const campaigns = [
        { id: '1', title: 'The Frozen Reach', description: 'A journey through the icy wastes of the North.', nextSession: 'Tomorrow, 7 PM' },
        { id: '2', title: 'Shadows over Oakhaven', description: 'Investigate the strange disappearances in the sleepy village.', nextSession: 'Sunday, 2 PM' },
    ];

    const characters = [
        { id: '1', name: 'Thrain Ironfoot', race: 'Dwarf', charClass: 'Fighter', level: 5 },
        { id: '2', name: 'Elowen Swiftwind', race: 'Elf', charClass: 'Ranger', level: 4 },
        { id: '3', name: 'Kaelen Sunsoul', race: 'Human', charClass: 'Cleric', level: 5 },
    ];

    const stories = [
        { id: '1', title: 'The Bridge of Khazad-dûm', excerpt: 'The ground shakes... drums, drums in the deep. We cannot get out.', date: 'Oct 24' },
        { id: '2', title: 'Arrival at Oakhaven', excerpt: 'The fog rolled in thick as we reached the village gates. Something felt wrong.', date: 'Oct 20' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-8 pb-4 flex-row justify-between items-center">
                    <View>
                        <Text className="text-typography-secondary text-sm font-medium uppercase tracking-tighter">
                            Adventure Awaits
                        </Text>
                        <Text className="text-3xl text-typography-primary font-bold" style={{ fontFamily: 'Cinzel' }}>
                            {offlineMode ? 'Local Vault' : 'Dashboard'}
                        </Text>
                    </View>
                    <View className="flex-row space-x-4">
                        <TouchableOpacity className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center border border-border-primary">
                            {React.createElement(Settings as any, { size: 20, color: "var(--color-text-secondary)" })}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={logout}
                            className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center border border-border-primary"
                        >
                            {React.createElement(LogOut as any, { size: 18, color: "var(--color-accent-primary)" })}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Campaigns Section */}
                <View className="mt-8">
                    <View className="px-6 flex-row justify-between items-end mb-4">
                        <View className="flex-row items-center">
                            {React.createElement(Swords as any, { size: 20, color: "var(--color-accent-secondary)", className: "mr-2" })}
                            <Text className="text-xl text-typography-primary font-bold" style={{ fontFamily: 'Cinzel' }}>
                                Active Campaigns
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-accent-primary font-bold">See All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                    >
                        {campaigns.map(campaign => (
                            <CampaignCard key={campaign.id} {...campaign} />
                        ))}
                        <TouchableOpacity
                            className="w-48 h-48 rounded-2xl border-2 border-dashed border-border-primary items-center justify-center mr-6"
                        >
                            {React.createElement(PlusCircle as any, { size: 32, color: "var(--color-border-primary)" })}
                            <Text className="text-typography-secondary mt-2 font-medium">New Campaign</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Characters Section */}
                <View className="mt-10">
                    <View className="px-6 flex-row justify-between items-end mb-4">
                        <View className="flex-row items-center">
                            {React.createElement(Users as any, { size: 20, color: "var(--color-accent-primary)", className: "mr-2" })}
                            <Text className="text-xl text-typography-primary font-bold" style={{ fontFamily: 'Cinzel' }}>
                                Your Heroes
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-accent-primary font-bold">Manage</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                    >
                        {characters.map(char => (
                            <CharacterCard key={char.id} {...char} />
                        ))}
                    </ScrollView>
                </View>

                {/* Recent Stories (Chronicle) */}
                <View className="mt-10 px-6 pb-12">
                    <Text className="text-xl text-typography-primary font-bold mb-6" style={{ fontFamily: 'Cinzel' }}>
                        The Chronicle
                    </Text>
                    {stories.map(story => (
                        <StoryCard key={story.id} {...story} />
                    ))}
                    <TouchableOpacity className="py-4 items-center">
                        <Text className="text-typography-secondary italic">Read full adventure logs...</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
