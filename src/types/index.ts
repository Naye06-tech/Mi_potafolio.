export interface Skill {
    id: number;
    name: string;
    level: number;
    category: 'Frontend' | 'Backend' | 'Database' | 'DevOps';
}

export interface Project {
    id: number;
    name: string;
    description: string;
    image: string;
    technologies: string[];
    demoUrl?: string;
    repoUrl?: string;
}

export interface NavItem {
    id: number;
    label: string;
}

export interface SocialLink {
    id: string;
    icon: string;
    url: string; 
    label: string;
}

export type Theme = 'light' | 'dark';