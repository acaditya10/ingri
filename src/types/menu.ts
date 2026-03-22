export interface MenuCategory {
    id: string;
    title: string;
    layout: 'standard' | 'tall' | 'wide';
    order: number;
}

export interface MenuItem {
    id: string;
    categoryId: string; // reference to parent category
    name: string;
    price: number | string;
    description: string;
    dietaryTags?: string[]; // e.g. "V", "GF"
    addOns?: string[];
    order: number;
}
