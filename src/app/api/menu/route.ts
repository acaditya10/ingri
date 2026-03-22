import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { MenuCategory, MenuItem } from '@/types/menu';

export const revalidate = 0; // Fetch fresh data dynamically

export async function GET() {
    try {
        const categoriesSnapshot = await adminDb.collection('menuCategories').orderBy('order', 'asc').get();
        const itemsSnapshot = await adminDb.collection('menuItems').orderBy('order', 'asc').get();

        const categories: MenuCategory[] = [];
        categoriesSnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() } as MenuCategory);
        });

        const items: MenuItem[] = [];
        itemsSnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as MenuItem);
        });

        const menu = categories.map((category) => ({
            ...category,
            items: items.filter((item) => item.categoryId === category.id),
        }));

        return NextResponse.json({ menu });
    } catch (error) {
        console.error('Error fetching menu:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
