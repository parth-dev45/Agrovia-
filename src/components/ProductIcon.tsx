import {
    Leaf,
    Apple,
    Cherry,
    Carrot,
    Salad,
    Sprout,
    Package,
    Egg,
    Sparkles,
    Circle,
    Flame,
    Droplet,
    Zap,
    Star,
    Triangle,
    type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon mapping for different product types - Each product gets a unique icon
const PRODUCT_ICONS: Record<string, LucideIcon> = {
    // Vegetables - Root (each with distinct icon)
    potato: Package,       // Brown/earthy feel
    onion: Circle,         // Round shape
    carrot: Carrot,        // Classic carrot
    beetroot: Droplet,     // Red/juice association
    radish: Circle,        // Small round - but different color via className
    ginger: Zap,           // Spicy/energetic
    garlic: Sparkles,      // Strong flavor/magical

    // Vegetables - Leafy (varied greens)
    cabbage: Package,      // Dense/compact head
    spinach: Leaf,         // Leaf vegetable
    lettuce: Salad,        // Salad greens
    coriander: Sprout,     // Fresh herb sprouting
    mint: Leaf,            // Aromatic leaf - different from spinach visually

    // Vegetables - Other (maximum variety)
    tomato: Cherry,        // Round fruit-vegetable
    broccoli: Sprout,      // Tree-like floret
    cauliflower: Star,     // Star-like floret pattern
    capsicum: Triangle,    // Bell/triangle shape hint
    cucumber: Package,     // Long cylindrical vegetable
    eggplant: Egg,         // Egg-shaped
    pumpkin: Circle,       // Large round gourd
    corn: Zap,             // Yellow kernels/energy
    peas: Circle,          // Small round peas
    beans: Sprout,         // Growing bean pods
    okra: Leaf,            // Green finger vegetable
    chili: Flame,          // Spicy/hot fire

    // Fruits (distinctive icons)
    apple: Apple,          // Classic apple
    banana: Package,       // Curved elongated fruit
    orange: Circle,        // Round citrus
    mango: Cherry,         // Tropical stone fruit
    grapes: Cherry,        // Berry cluster
    watermelon: Circle,    // Large round melon
    strawberry: Star,      // Star-shaped berry with seeds
    pineapple: Sparkles,   // Tropical/special crown
    papaya: Egg,           // Oval tropical fruit
    pomegranate: Apple,    // Round fruit with crown
    guava: Circle,         // Round tropical fruit
    lemon: Triangle,       // Citrus wedge/triangle shape
};

interface ProductIconProps {
    productId: string;
    className?: string;
    size?: number;
}

export function ProductIcon({ productId, className, size }: ProductIconProps) {
    const IconComponent = PRODUCT_ICONS[productId] || Package;

    return (
        <IconComponent
            className={cn("text-primary", className)}
            size={size}
        />
    );
}
