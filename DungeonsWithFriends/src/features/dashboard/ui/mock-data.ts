/**
 * Mock data for the Dashboard following the dungeons-friends-hub design.
 * This data mimics the structure from the reference implementation.
 */

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  campaignName: string;
  hp: number;
  maxHp: number;
}

export interface Campaign {
  id: string;
  name: string;
  system: string;
  dm: string;
  status: "active" | "upcoming" | "recruiting";
  players: number;
  maxPlayers: number;
  nextSession?: string;
  description: string;
  friendsJoined: string[];
}

export interface HeroData {
  userName: string;
  campaignName: string;
  nextSession: string;
}

export const heroData: HeroData = {
  userName: "Kaelith",
  campaignName: "Curse of Strahd",
  nextSession: "Tomorrow, 7 PM"
};

export const friends: Friend[] = [
  { id: "1", name: "Ravenna", avatar: "R", online: true },
  { id: "2", name: "Thorin", avatar: "T", online: true },
  { id: "3", name: "Lyria", avatar: "L", online: false },
  { id: "4", name: "Gareth", avatar: "G", online: true },
  { id: "5", name: "Sylph", avatar: "S", online: false },
  { id: "6", name: "Orik", avatar: "O", online: false }
];

export const characters: Character[] = [
  { 
    id: "1", 
    name: "Kaelith Darkbane", 
    class: "Warlock", 
    level: 7, 
    race: "Tiefling", 
    campaignName: "Curse of Strahd", 
    hp: 38, 
    maxHp: 45 
  },
  { 
    id: "2", 
    name: "Brother Aldric", 
    class: "Cleric", 
    level: 5, 
    race: "Human", 
    campaignName: "Tomb of the Serpent King", 
    hp: 32, 
    maxHp: 32 
  },
  { 
    id: "3", 
    name: "Zephyra Windwalker", 
    class: "Ranger", 
    level: 3, 
    race: "Elf", 
    campaignName: "Lost Mine of Phandelver", 
    hp: 22, 
    maxHp: 28 
  }
];

export const myCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Curse of Strahd",
    system: "D&D 5e",
    dm: "Marcus",
    status: "active",
    players: 5,
    maxPlayers: 6,
    nextSession: "Tomorrow, 7 PM",
    description: "Deep in the mists of Barovia, your party faces the vampire lord.",
    friendsJoined: ["1", "2"]
  },
  {
    id: "2",
    name: "Tomb of the Serpent King",
    system: "Shadowdark",
    dm: "Elena",
    status: "active",
    players: 4,
    maxPlayers: 5,
    nextSession: "Saturday, 3 PM",
    description: "A classic dungeon crawl in the deadly Shadowdark system.",
    friendsJoined: ["4"]
  },
  {
    id: "3",
    name: "Lost Mine of Phandelver",
    system: "D&D 5e",
    dm: "You",
    status: "upcoming",
    players: 3,
    maxPlayers: 5,
    nextSession: "Next Wednesday",
    description: "A starter adventure leading to the legendary Wave Echo Cave.",
    friendsJoined: ["3", "5"]
  }
];

export const recruitingCampaigns: Campaign[] = [
  {
    id: "r1",
    name: "Blades in the Dark",
    system: "Blades in the Dark",
    dm: "Cassius",
    status: "recruiting",
    players: 2,
    maxPlayers: 5,
    description: "A crew of daring scoundrels seeking their fortune in a haunted city.",
    friendsJoined: ["1", "4"]
  },
  {
    id: "r2",
    name: "The Sunless Citadel",
    system: "D&D 5e",
    dm: "Priya",
    status: "recruiting",
    players: 3,
    maxPlayers: 6,
    description: "An ancient fortress sunk into the earth, filled with goblins and worse.",
    friendsJoined: ["2"]
  },
  {
    id: "r3",
    name: "Mothership: Dead Planet",
    system: "Mothership",
    dm: "Jake",
    status: "recruiting",
    players: 1,
    maxPlayers: 4,
    description: "Sci-fi horror RPG. Your ship has found a derelict... something is alive.",
    friendsJoined: []
  },
  {
    id: "r4",
    name: "Dolmenwood Campaign",
    system: "Old-School Essentials",
    dm: "Fern",
    status: "recruiting",
    players: 4,
    maxPlayers: 6,
    description: "Explore the strange and whimsical Dolmenwood, a fairy-tale hexcrawl.",
    friendsJoined: ["3", "6"]
  }
];
