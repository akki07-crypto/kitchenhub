import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_RECIPES } from '../assets/recipesData';

// Data Structures
export interface ICookedVersion {
  recipeId: string;
  recipeTitle: string;
  image: string;
  comment: string;
  date: string;
}

export interface IUser {
  id: string;
  name: string;
  email?: string;
  password?: string;
  avatar: string;
  bio: string;
  level: string; // 'Novice Cook' | 'Home Chef' | 'Master Chef'
  savedRecipes: string[]; // recipe IDs
  cookedVersions: ICookedVersion[];
  badges: string[];
  role: 'user' | 'chef' | 'admin';
}

export interface IRecipeReview {
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface IRecipeCookedVersion {
  userName: string;
  userAvatar: string;
  image: string;
  comment: string;
  date: string;
}

export interface IRecipe {
  id: string;
  title: string;
  chef: string;
  image: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Expert';
  calories: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  category?: 'High Protein' | 'High Calorie' | 'Sweet Dessert' | 'Vegetarian' | 'Chef Special' | string;
  tags?: string[];
  videoUrl: string;
  ingredients: string[];
  steps: string[];
  tools: string[]; // tool names matching marketplace tools
  reviews: IRecipeReview[];
  cookedVersions: IRecipeCookedVersion[];
}

export interface IClass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorAvatar: string;
  duration: string;
  level: string;
  image: string;
  videoUrl: string;
  rating: number;
  studentsCount: number;
}

export interface IMarketplaceTool {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  purchaseUrl: string;
}

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  upvotes: number;
  votedBy: string[];
  createdAt: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  votedBy: string[];
  replies: ForumReply[];
  createdAt: string;
}

export interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
}

export type MealPlanDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type MealSlot = 'breakfast' | 'lunch' | 'dinner';

export interface IMealPlanSlot {
  breakfast?: IRecipe;
  lunch?: IRecipe;
  dinner?: IRecipe;
}

export type IMealPlan = Record<MealPlanDay, IMealPlanSlot>;

interface AppContextType {
  currentUser: IUser | null;
  isLoggedIn: boolean;
  showAuthModal: boolean;
  recipes: IRecipe[];
  classes: IClass[];
  marketplaceTools: IMarketplaceTool[];
  forumPosts: ForumPost[];
  messages: Message[];
  usersList: IUser[];
  chefsList: IUser[];
  pendingChefsList: IUser[];
  currentView: string;
  activeRecipeId: string | null;
  activeClassId: string | null;
  theme: 'dark' | 'light';
  groceryList: string[];
  cartItems: { tool: IMarketplaceTool; quantity: number }[];
  mealPlan: IMealPlan;
  toast: { message: string; type?: 'success' | 'info' | 'warning' } | null;
  setCurrentView: (view: string) => void;
  setActiveRecipeId: (id: string | null) => void;
  setActiveClassId: (id: string | null) => void;
  setShowAuthModal: (show: boolean) => void;
  toggleTheme: () => void;
  updateProfile: (updatedProfile: Partial<IUser>) => Promise<void>;
  saveRecipe: (recipeId: string) => Promise<void>;
  submitReview: (recipeId: string, rating: number, comment: string) => Promise<void>;
  uploadCookedVersion: (recipeId: string, image: string, comment: string) => Promise<void>;
  createForumPost: (title: string, content: string, tags: string[]) => Promise<void>;
  replyToPost: (postId: string, content: string) => Promise<void>;
  upvotePost: (postId: string) => Promise<void>;
  sendMessage: (content: string) => void;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  addRecipe: (recipe: Partial<IRecipe>) => void;
  applyAsChef: (chefData: { name: string; email: string; password?: string; bio: string; level: string; avatar: string; }) => void;
  approveChef: (chefId: string) => void;
  deactivateChef: (chefId: string) => void;
  deleteUser: (userId: string) => void;
  deleteRecipe: (recipeId: string) => void;
  deleteClass: (classId: string) => void;
  registerUser: (userData: Partial<IUser>) => Promise<void>;
  addClass: (classData: Partial<IClass>) => void;
  addToGroceryList: (ingredients: string[]) => void;
  removeFromGroceryList: (ingredient: string) => void;
  clearGroceryList: () => void;
  addToCart: (tool: IMarketplaceTool) => void;
  removeFromCart: (toolId: string) => void;
  updateCartQuantity: (toolId: string, delta: number) => void;
  clearCart: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  addToMealPlan: (day: MealPlanDay, slot: MealSlot, recipe: IRecipe) => void;
  removeFromMealPlan: (day: MealPlanDay, slot: MealSlot) => void;
  exportMealPlanToGrocery: () => void;
  activeDelivery: { service: string; status: string; progress: number; itemsCount: number; timeLeft: number } | null;
  placeDeliveryOrder: (service: string, itemsCount: number) => void;
  cancelDelivery: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- CULINARY FALLBACK DATA CONSTANTS ---

const MOCK_TOOLS: IMarketplaceTool[] = [
  {
    id: 'cast-iron-skillet',
    name: 'Smithey Cast Iron Skillet (12-inch)',
    price: 210,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=80',
    description: 'An ultra-premium polished cast iron skillet, ideal for obtaining restaurant-grade crusts on meats.',
    purchaseUrl: 'https://smithey.com/'
  },
  {
    id: 'culinary-blowtorch',
    name: 'Iwatani Pro Culinary Torch',
    price: 45,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
    description: 'Heavy-duty butane torch providing precise control for caramelizing meringues and searing toppings.',
    purchaseUrl: 'https://iwatani.com/'
  },
  {
    id: 'sous-vide-cooker',
    name: 'Anova Precision Cooker Pro',
    price: 199,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80',
    description: 'Immersion circulator built for heavy-duty cooking, heating water to within 0.05°C of target temperature.',
    purchaseUrl: 'https://anovaculinary.com/'
  },
  {
    id: 'precision-tweezers',
    name: 'Mercer Culinary Offset Plating Tweezers',
    price: 18,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&auto=format&fit=crop&q=80',
    description: 'Surgical-grade stainless steel offset tweezers, built for plating delicate microgreens and garnish elements.',
    purchaseUrl: 'https://www.mercerculinary.com/'
  },
  {
    id: 'saffron-plate',
    name: 'Bernardaud Porcelain Saffron Coupe Plate',
    price: 65,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=80',
    description: 'Exquisite French porcelain plate with a slight curve, designed specifically to showcase seafood and broth dishes.',
    purchaseUrl: 'https://www.bernardaud.com/'
  },
  {
    id: 'chef-knife',
    name: 'Yaxell Super Gou Damascus Chef Knife (8-inch)',
    price: 285,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=500&auto=format&fit=crop&q=80',
    description: 'Ultra-premium 161-layer Damascus steel chef knife hand-crafted in Seki, Japan for surgical slicing precision.',
    purchaseUrl: 'https://yaxell.com/'
  },
  {
    id: 'stand-mixer',
    name: 'KitchenAid Commercial 8-Quart Mixer',
    price: 799,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1595166180348-18e38d72dfa8?w=500&auto=format&fit=crop&q=80',
    description: 'Powerful commercial stand mixer featuring an 8-quart bowl-lift design for large culinary preparations.',
    purchaseUrl: 'https://www.kitchenaid.com/'
  },
  {
    id: 'dutch-oven',
    name: 'Le Creuset Enameled Cast Iron Dutch Oven (5.5 Qt)',
    price: 380,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=80',
    description: 'Iconic French enameled cast iron pot providing unmatched heat retention for slow braises and artisanal sourdough bread.',
    purchaseUrl: 'https://www.lecreuset.com/'
  },
  {
    id: 'smart-blender',
    name: 'Vitamix A3500 Ascent Series Smart Blender',
    price: 650,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=80',
    description: 'Commercial-grade high-speed blender for creating silky Velouté sauces, smooth nut milks, and molecular emulsions.',
    purchaseUrl: 'https://www.vitamix.com/'
  },
  {
    id: 'microplane-zester',
    name: 'Microplane Premium Classic Zester & Grater',
    price: 18,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1590794056226-77ef3a6c474e?w=500&auto=format&fit=crop&q=80',
    description: 'Photo-etched stainless steel blade used by top pastry chefs for citrus zest, nutmeg, and delicate parmesan snow.',
    purchaseUrl: 'https://www.microplane.com/'
  },
  {
    id: 'nakiri-knife',
    name: 'Shun Premier Nakiri Vegetable Knife (6.5-inch)',
    price: 190,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=500&auto=format&fit=crop&q=80',
    description: 'Hand-hammered Tsuchime finish Nakiri blade designed for rapid, clean vegetable chopping without sticking.',
    purchaseUrl: 'https://shun.kaiusa.com/'
  },
  {
    id: 'copper-pan',
    name: 'Mauviel 1830 M\'Heritage Copper Sauté Pan',
    price: 320,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80',
    description: 'Traditional French 90% copper sauté pan with stainless steel interior for instantaneous temperature responsiveness.',
    purchaseUrl: 'https://mauviel-usa.com/'
  },
  {
    id: 'mortar-pestle',
    name: 'Solid Granite Heavy Mortar & Pestle (2-Cup)',
    price: 45,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80',
    description: 'Unpolished granite interior ideal for crushing whole spices, grinding pesto, and creating authentic Indian masala pastes.',
    purchaseUrl: 'https://www.amazon.com/'
  },
  {
    id: 'konro-grill',
    name: 'Tabletop Binchotan Charcoal Konro Grill',
    price: 160,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
    description: 'Diatomite brick grill designed to burn ultra-hot Binchotan charcoal for high-heat Yakitori and charred seared skewers.',
    purchaseUrl: 'https://korin.com/'
  }
];

const MOCK_CLASSES: IClass[] = [
  {
    id: 'knife-skills',
    title: 'Knife Skills Masterclass: Precision & Speed',
    description: 'Learn the proper grip, knife maintenance, and how to execute perfect julienne, chiffonade, and brunoise cuts like a professional line cook.',
    instructor: 'Chef Jean-Pierre',
    instructorBio: 'Classical French chef with 20+ years of kitchen leadership in Michelin-starred Parisian restaurants.',
    instructorAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    duration: '45 mins',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=YoxXQ4n3Zws',
    rating: 4.9,
    studentsCount: 1540
  },
  {
    id: 'plate-styling',
    title: 'The Art of Modern Plate Styling',
    description: 'Elevate your home cooking into edible art. Master sauce sweeps, stacking, height, color harmony, and delicate garnishing techniques.',
    instructor: 'Chef Melissa Thorne',
    instructorBio: 'Culinary stylist and author of "Plating Perfection". Known for her gorgeous minimalist photography.',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    duration: '1h 15m',
    level: 'Expert',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=F3xO2L7hCg0',
    rating: 5.0,
    studentsCount: 3820
  }
];

const MOCK_FORUM: ForumPost[] = [
  {
    id: 'post-1',
    authorId: 'user-elena',
    authorName: 'Elena Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'The Secret to a Perfect Béarnaise Emulsification',
    content: 'The key is temperature control. If the sauce gets too hot, the eggs scramble; too cold, the butter solidifies. Whisk off the heat and keep your warm water bath nearby. If it breaks, whisk a teaspoon of warm water with a touch of yolk in a clean bowl and slowly whisk the broken sauce back in.',
    tags: ['French Cuisine', 'Sauces', 'Technique'],
    upvotes: 24,
    votedBy: ['user-current'],
    createdAt: '2026-07-18T10:00:00Z',
    replies: [
      {
        id: 'rep-1',
        authorId: 'user-current',
        authorName: 'Alex Rivera',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Wow, this yolk tip saved my dinner! I was about to throw out my split sauce and restart. Thank you Chef!',
        upvotes: 8,
        votedBy: ['user-elena'],
        createdAt: '2026-07-18T11:45:00Z'
      }
    ]
  }
];

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [recipes, setRecipes] = useState<IRecipe[]>(INITIAL_RECIPES);
  const [classes, setClasses] = useState<IClass[]>(MOCK_CLASSES);
  const [marketplaceTools, setMarketplaceTools] = useState<IMarketplaceTool[]>(MOCK_TOOLS);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_FORUM);
  const [messages, setMessages] = useState<Message[]>([
    {
      senderId: 'sommelier',
      receiverId: 'user-current',
      content: 'Salutations! I am your Kitchen Hub Culinary Concierge & Master Sommelier. Ask me about wine pairings, ingredient substitutions, or molecular techniques!',
      createdAt: new Date().toISOString()
    }
  ]);

  // Role Directories
  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [chefsList, setChefsList] = useState<IUser[]>([]);
  const [pendingChefsList, setPendingChefsList] = useState<IUser[]>([]);

  const [currentView, setCurrentView] = useState('home');
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Real-World State Enhancements
  const [groceryList, setGroceryList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kh_grocery_list');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [cartItems, setCartItems] = useState<{ tool: IMarketplaceTool; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem('kh_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [mealPlan, setMealPlan] = useState<IMealPlan>(() => {
    try {
      const saved = localStorage.getItem('kh_meal_plan');
      return saved ? JSON.parse(saved) : { mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {} };
    } catch (e) {
      return { mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {} };
    }
  });

  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('kh_meal_plan', JSON.stringify(mealPlan));
    } catch (e) {}
  }, [mealPlan]);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('kh_grocery_list', JSON.stringify(groceryList));
    } catch (e) {}
  }, [groceryList]);

  useEffect(() => {
    try {
      localStorage.setItem('kh_cart_items', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };
  const [activeDelivery, setActiveDelivery] = useState<{
    service: string;
    status: string;
    progress: number;
    itemsCount: number;
    timeLeft: number;
  } | null>(null);

  useEffect(() => {
    if (!activeDelivery) return;
    if (activeDelivery.timeLeft <= 0) {
      showToast(`🛒 Order delivered! ${activeDelivery.itemsCount} items are at your doorstep.`, 'success');
      clearGroceryList();
      setActiveDelivery(null);
      return;
    }

    const timer = setTimeout(() => {
      setActiveDelivery(prev => {
        if (!prev) return null;
        const nextTimeLeft = prev.timeLeft - 1;
        const nextProgress = Math.min(100, Math.floor(((120 - nextTimeLeft) / 120) * 100));
        
        let nextStatus = "Carting ingredients...";
        if (nextProgress >= 15 && nextProgress < 40) {
          nextStatus = "Sourcing fresh produce...";
        } else if (nextProgress >= 40 && nextProgress < 75) {
          nextStatus = "Driver transit on map...";
        } else if (nextProgress >= 75 && nextProgress < 100) {
          nextStatus = "Arriving at doorstep...";
        } else if (nextProgress >= 100) {
          nextStatus = "Delivered! Bon Appétit! 🎉";
        }

        return {
          ...prev,
          timeLeft: nextTimeLeft,
          progress: nextProgress,
          status: nextStatus
        };
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeDelivery]);

  const placeDeliveryOrder = (service: string, itemsCount: number) => {
    setActiveDelivery({
      service,
      status: "Packing bags...",
      progress: 0,
      itemsCount,
      timeLeft: 120
    });
    showToast(`⚡ Order placed via ${service}! Tracking live.`, 'success');
  };

  const cancelDelivery = () => {
    setActiveDelivery(null);
    showToast('Grocery delivery cancelled.', 'info');
  };

  const addToGroceryList = (ingredients: string[]) => {
    setGroceryList(prev => Array.from(new Set([...prev, ...ingredients])));
    showToast(`Added ${ingredients.length} items to Grocery List!`, 'success');
  };

  const removeFromGroceryList = (ingredient: string) => {
    setGroceryList(prev => prev.filter(item => item !== ingredient));
  };

  const clearGroceryList = () => {
    setGroceryList([]);
    showToast('Grocery list cleared', 'info');
  };

  const addToCart = (tool: IMarketplaceTool) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.tool.id === tool.id);
      if (existing) {
        return prev.map(item => item.tool.id === tool.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { tool, quantity: 1 }];
    });
    showToast(`Added "${tool.name}" to cart!`, 'success');
  };

  const removeFromCart = (toolId: string) => {
    setCartItems(prev => prev.filter(item => item.tool.id !== toolId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (toolId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.tool.id === toolId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as { tool: IMarketplaceTool; quantity: number }[];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addToMealPlan = (day: MealPlanDay, slot: MealSlot, recipe: IRecipe) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: recipe
      }
    }));
    showToast(`Scheduled "${recipe.title.split(' with ')[0]}" for ${day.toUpperCase()} ${slot}!`, 'success');
  };

  const removeFromMealPlan = (day: MealPlanDay, slot: MealSlot) => {
    setMealPlan(prev => {
      const updated = { ...prev[day] };
      delete updated[slot];
      return { ...prev, [day]: updated };
    });
    showToast(`Removed meal from ${day.toUpperCase()} ${slot}`, 'info');
  };

  const exportMealPlanToGrocery = () => {
    const allIngredients: string[] = [];
    Object.values(mealPlan).forEach(daySlot => {
      Object.values(daySlot).forEach(recipe => {
        if (recipe && recipe.ingredients) {
          allIngredients.push(...recipe.ingredients);
        }
      });
    });

    if (allIngredients.length === 0) {
      showToast('No meals scheduled in your weekly planner yet!', 'warning');
      return;
    }

    addToGroceryList(allIngredients);
    showToast(`Exported ${allIngredients.length} ingredients to Grocery List!`, 'success');
  };

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  // Demo users — always available offline (no MongoDB needed)
  const DEMO_USERS: IUser[] = [
    {
      id: 'demo-user-alex',
      name: 'Alex Johnson',
      email: 'alex@kitchenhub.com',
      password: 'password',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bio: 'Home Cook · Passionate about Italian and Asian fusion.',
      level: 'Home Chef',
      savedRecipes: [],
      cookedVersions: [],
      badges: ['🍳 First Cook', '⭐ Recipe Saver'],
      role: 'user'
    },
    {
      id: 'demo-chef-melissa',
      name: 'Chef Melissa Laurent',
      email: 'melissa@kitchenhub.com',
      password: 'chef123',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
      bio: 'Professional Chef · Classic French Sauces & Modern Plating.',
      level: 'Master Chef',
      savedRecipes: [],
      cookedVersions: [],
      badges: ['👨‍🍳 Verified Chef', '🏆 Recipe Creator', '⭐ Top Rated'],
      role: 'chef'
    },
    {
      id: 'demo-admin',
      name: 'Kitchen Hub Admin',
      email: 'admin@kitchenhub.com',
      password: 'admin123',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      bio: 'Platform Administrator · Managing the Kitchen Hub ecosystem.',
      level: 'Master Chef',
      savedRecipes: [],
      cookedVersions: [],
      badges: ['🛡️ Admin', '👨‍🍳 Verified Chef'],
      role: 'admin'
    }
  ];

  // Auth Operations - Validates typed email & password credentials against backend
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    // 1. Always try demo users first (works fully offline)
    const demoMatch = DEMO_USERS.find(
      u => u.email?.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (demoMatch) {
      const { password: _pw, ...safeUser } = demoMatch;
      localStorage.setItem('kh_user_id', safeUser.id);
      setCurrentUser(safeUser as IUser);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      showToast(`Welcome back, ${safeUser.name}! 👋`, 'success');
      return { success: true };
    }

    // 2. Try backend (MongoDB) for real registered users
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data && !data.error) {
        localStorage.setItem('kh_user_id', data.id);
        setCurrentUser(data);
        setIsLoggedIn(true);
        setShowAuthModal(false);
        showToast(`Welcome back, ${data.name}!`, 'success');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials.' };
      }
    } catch (err) {
      console.warn('Backend unavailable, only demo accounts supported offline.');
      return { success: false, error: 'Invalid email or password.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('kh_user_id');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setShowAuthModal(false);
    setCurrentView('home');
    showToast('Logged out successfully.', 'info');
  };

  const registerUser = async (userData: Partial<IUser>): Promise<void> => {
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data && !data.error) {
        if (data.role === 'chef') {
          showToast('Chef application submitted successfully!', 'success');
        } else {
          localStorage.setItem('kh_user_id', data.id);
          setCurrentUser(data);
          setIsLoggedIn(true);
          setShowAuthModal(false);
          showToast(`Welcome to Kitchen Hub, ${data.name}!`, 'success');
        }
        refreshData();
      } else {
        showToast(data.error || 'Registration failed.', 'warning');
      }
    } catch (err) {
      console.warn('Failed to register:', err);
      showToast('Database connection error during registration.', 'warning');
    }
  };

  const addRecipe = (recipeData: Partial<IRecipe>) => {
    const newRecipe: IRecipe = {
      id: recipeData.id || `recipe-${Date.now()}`,
      title: recipeData.title || 'New Gourmet Creation',
      chef: recipeData.chef || currentUser?.name || 'Grand Chef',
      image: recipeData.image || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600',
      description: recipeData.description || 'A masterpiece of modernist culinary design.',
      prepTime: recipeData.prepTime || '30 mins',
      difficulty: (recipeData.difficulty as any) || 'Medium',
      calories: Number(recipeData.calories) || 450,
      videoUrl: recipeData.videoUrl || 'https://www.youtube.com/watch?v=F3xO2L7hCg0',
      ingredients: recipeData.ingredients || [],
      steps: recipeData.steps || [],
      tools: recipeData.tools || [],
      reviews: [],
      cookedVersions: []
    };
    setRecipes(prev => [newRecipe, ...prev]);
  };

  const addClass = (classData: Partial<IClass>) => {
    const newClass: IClass = {
      id: classData.id || `class-${Date.now()}`,
      title: classData.title || 'New Culinary Masterclass',
      description: classData.description || 'Learn premium culinary techniques.',
      instructor: classData.instructor || currentUser?.name || 'Chef',
      instructorBio: classData.instructorBio || currentUser?.bio || 'A passionate culinary educator.',
      instructorAvatar: classData.instructorAvatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
      duration: classData.duration || '45 mins',
      level: classData.level || 'Beginner',
      image: classData.image || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      videoUrl: classData.videoUrl || 'https://www.youtube.com/watch?v=YoxXQ4n3Zws',
      rating: 5.0,
      studentsCount: 0
    };
    setClasses(prev => [newClass, ...prev]);
  };

  // Chef Registration Application
  const applyAsChef = (chefData: { name: string; email: string; password?: string; bio: string; level: string; avatar: string; }) => {
    const newApplicant: IUser = {
      id: `pending-${Date.now()}`,
      name: chefData.name,
      email: chefData.email,
      password: chefData.password || 'chef123',
      avatar: chefData.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
      bio: chefData.bio,
      level: chefData.level || 'Master Chef',
      savedRecipes: [],
      cookedVersions: [],
      badges: ['Chef Applicant'],
      role: 'chef'
    };
    setPendingChefsList(prev => [...prev, newApplicant]);
  };

  // Admin approvals & moderation controls (PURA CONTROL)
  const approveChef = async (chefId: string) => {
    const chefToApprove = pendingChefsList.find(c => c.id === chefId);
    if (!chefToApprove) return;
    
    const updatedChef = { ...chefToApprove, badges: ['Approved Chef'] };
    try {
      await fetch(`/api/users/${chefId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedChef)
      });
      showToast('✨ Chef credentials activated!', 'success');
      refreshData();
    } catch (err) {
      console.warn('Failed to approve chef:', err);
    }
  };

  const deactivateChef = async (chefId: string) => {
    try {
      await fetch(`/api/users/${chefId}`, {
        method: 'DELETE'
      });
      showToast('Chef account deactivated.', 'info');
      refreshData();
    } catch (err) {
      console.warn('Failed to deactivate chef:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      showToast('User account deleted.', 'info');
      refreshData();
    } catch (err) {
      console.warn('Failed to delete user:', err);
    }
  };

  const deleteRecipe = (recipeId: string) => {
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
  };

  const deleteClass = (classId: string) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
  };

  // Fetch initial data from server
  const refreshData = async () => {
    try {
      const savedUserId = localStorage.getItem('kh_user_id');
      if (savedUserId) {
        const resUser = await fetch(`/api/users/current?id=${savedUserId}`);
        const dataUser = await resUser.json();
        if (dataUser && !dataUser.error) {
          setCurrentUser(dataUser);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('kh_user_id');
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }

      const resRecipes = await fetch('/api/recipes');
      const dataRecipes = await resRecipes.json();
      if (dataRecipes && Array.isArray(dataRecipes)) {
        setRecipes(dataRecipes);
      }

      const resClasses = await fetch('/api/classes');
      const dataClasses = await resClasses.json();
      if (dataClasses && Array.isArray(dataClasses)) {
        setClasses(dataClasses);
      }

      const resTools = await fetch('/api/marketplace-tools');
      const dataTools = await resTools.json();
      if (dataTools && Array.isArray(dataTools)) {
        setMarketplaceTools(dataTools);
      }

      const resForum = await fetch('/api/forum');
      const dataForum = await resForum.json();
      if (dataForum && Array.isArray(dataForum)) {
        setForumPosts(dataForum);
      }

      const resUsers = await fetch('/api/users');
      const dataUsers = await resUsers.json();
      if (dataUsers && Array.isArray(dataUsers)) {
        setUsersList(dataUsers.filter((u: IUser) => u.role === 'user' || u.role === 'admin'));
        setChefsList(dataUsers.filter((u: IUser) => u.role === 'chef' && !u.badges.includes('Chef Applicant')));
        setPendingChefsList(dataUsers.filter((u: IUser) => u.role === 'chef' && u.badges.includes('Chef Applicant')));
      }
    } catch (err) {
      console.warn('Failed to fetch platform data from server, utilizing local fallbacks:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Update profile handler
  const updateProfile = async (updatedFields: Partial<IUser>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    try {
      await fetch('/api/users/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Failed to sync profile update to server:', err);
    }
  };

  // Save/Unsave recipe
  const saveRecipe = async (recipeId: string) => {
    if (!currentUser) return;
    let nextSaved = [...currentUser.savedRecipes];
    const idx = nextSaved.indexOf(recipeId);
    if (idx > -1) {
      nextSaved.splice(idx, 1);
    } else {
      nextSaved.push(recipeId);
    }
    setCurrentUser(prev => prev ? { ...prev, savedRecipes: nextSaved } : null);

    try {
      await fetch('/api/users/current/saved-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId })
      });
    } catch (err) {
      console.warn('Failed to toggle saved recipe on server:', err);
    }
  };

  // Submit recipe review
  const submitReview = async (recipeId: string, rating: number, comment: string) => {
    const reviewerName = currentUser?.name || 'Anonymous Cook';
    const reviewData = {
      reviewerName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setRecipes(prevRecipes => prevRecipes.map(recipe => {
      if (recipe.id === recipeId) {
        return {
          ...recipe,
          reviews: [...recipe.reviews, reviewData]
        };
      }
      return recipe;
    }));

    try {
      const res = await fetch(`/api/recipes/${recipeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const updatedRecipe = await res.json();
      if (updatedRecipe && !updatedRecipe.error) {
        setRecipes(prev => prev.map(r => r.id === recipeId ? updatedRecipe : r));
      }
    } catch (err) {
      console.warn('Failed to submit review to server:', err);
    }
  };

  // Upload user cooked version photo
  const uploadCookedVersion = async (recipeId: string, image: string, comment: string) => {
    const userName = currentUser?.name || 'Anonymous Cook';
    const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    const payload = {
      userName,
      userAvatar,
      image,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setRecipes(prevRecipes => prevRecipes.map(recipe => {
      if (recipe.id === recipeId) {
        return {
          ...recipe,
          cookedVersions: [...recipe.cookedVersions, payload]
        };
      }
      return recipe;
    }));

    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        cookedVersions: [
          ...prev.cookedVersions,
          {
            recipeId,
            recipeTitle: recipes.find(r => r.id === recipeId)?.title || 'Culinary Creation',
            image,
            comment,
            date: new Date().toISOString().split('T')[0]
          }
        ]
      }) : null);
    }

    try {
      const res = await fetch(`/api/recipes/${recipeId}/cooked`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const updatedRecipe = await res.json();
      if (updatedRecipe && !updatedRecipe.error) {
        setRecipes(prev => prev.map(r => r.id === recipeId ? updatedRecipe : r));
      }
    } catch (err) {
      console.warn('Failed to sync cooked outcome to server:', err);
    }
  };

  // Create discussion forum post
  const createForumPost = async (title: string, content: string, tags: string[]) => {
    const authorId = currentUser?.id || 'anonymous';
    const authorName = currentUser?.name || 'Guest Cook';
    const authorAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

    const newPost = {
      id: `post-${Date.now()}`,
      authorId,
      authorName,
      authorAvatar,
      title,
      content,
      tags,
      upvotes: 0,
      votedBy: [],
      replies: [],
      createdAt: new Date().toISOString()
    };

    setForumPosts(prev => [newPost, ...prev]);

    try {
      await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
    } catch (err) {
      console.warn('Failed to save forum post to server:', err);
    }
  };

  // Reply to forum post
  const replyToPost = async (postId: string, content: string) => {
    const authorId = currentUser?.id || 'anonymous';
    const authorName = currentUser?.name || 'Guest Cook';
    const authorAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

    const newReply = {
      id: `rep-${Date.now()}`,
      authorId,
      authorName,
      authorAvatar,
      content,
      upvotes: 0,
      votedBy: [],
      createdAt: new Date().toISOString()
    };

    let updatedPost: ForumPost | undefined;
    setForumPosts(posts => posts.map(post => {
      if (post.id === postId) {
        updatedPost = { ...post, replies: [...post.replies, newReply] };
        return updatedPost;
      }
      return post;
    }));

    if (updatedPost) {
      try {
        await fetch(`/api/forum/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost)
        });
      } catch (err) {
        console.warn('Failed to save reply to server:', err);
      }
    }
  };

  // Upvote forum post
  const upvotePost = async (postId: string) => {
    if (!currentUser) return;
    let updatedPost: ForumPost | undefined;
    setForumPosts(posts => posts.map(post => {
      if (post.id === postId) {
        const alreadyVoted = post.votedBy.includes(currentUser.id);
        const nextVotes = alreadyVoted 
          ? post.votedBy.filter(id => id !== currentUser.id)
          : [...post.votedBy, currentUser.id];
        
        updatedPost = {
          ...post,
          upvotes: post.upvotes + (alreadyVoted ? -1 : 1),
          votedBy: nextVotes
        };
        return updatedPost;
      }
      return post;
    }));

    if (updatedPost) {
      try {
        await fetch(`/api/forum/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost)
        });
      } catch (err) {
        console.warn('Failed to upvote post on server:', err);
      }
    }
  };

  // Concierge chat response system (Supports backend Gemini AI + smart multilingual fallback)
  const sendMessage = async (content: string) => {
    const userMsg: Message = {
      senderId: 'user-current',
      receiverId: 'sommelier',
      content,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);

    // 1. Try Gemini AI API via backend
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });
      const data = await res.json();

      if (res.ok && data && data.reply) {
        const agentMsg: Message = {
          senderId: 'sommelier',
          receiverId: 'user-current',
          content: data.reply,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, agentMsg]);
        return;
      }
    } catch (e) {
      console.warn('Backend AI chat unavailable, using local intelligence:', e);
    }

      // 2. Local Fallback Intelligence (Hindi, Hinglish & English)
      setTimeout(() => {
        let replyText = "That sounds fascinating! As your Kitchen Hub Master Chef AI, I suggest pairing that dish with a crisp Sauvignon Blanc or a light Pinot Noir to enhance aromatics.";
        const cleanContent = content.toLowerCase();

        // Hindi / Hinglish query detection
        const isHindi = cleanContent.includes('kaise') || cleanContent.includes('kya') || cleanContent.includes('batao') || cleanContent.includes('karo') || cleanContent.includes('banaye') || cleanContent.includes('namaste') || cleanContent.includes('khana') || cleanContent.includes('bhai') || cleanContent.includes('madad') || cleanContent.includes('chahiye');

        if (cleanContent.includes('paneer') || cleanContent.includes('tikka') || cleanContent.includes('cottage cheese')) {
          replyText = isHindi
            ? "Paneer Tikka ke liye master tip: Paneer ko 30 min hung curd, roasted besan, mustard oil aur Kashmiri chili powder mein marinate karein. Coal dhungar technique se restaurant-style smoky flavor milta hai!"
            : "For Paneer Tikka, marinate in hung curd, roasted besan, mustard oil, and Kashmiri chili for 30+ mins. Use a glowing charcoal briquette for authentic smoky tandoori aroma!";
        } else if (cleanContent.includes('biryani') || cleanContent.includes('pulao') || cleanContent.includes('rice')) {
          replyText = isHindi
            ? "Gourmet Biryani Tip: Aged Basmati rice ko 30 min soak karein aur 70% cook hone par hi dum dein. Mutton/Chicken Biryani ke sath Syrah/Shiraz wine ya chilled Jeera Raita perfect lagta hai!"
            : "Biryani Excellence: Soak aged Basmati for 30 mins and cook to 70% before layering for dum. Pair mutton or chicken biryani with a medium-bodied Shiraz or Grenache Rosé.";
        } else if (cleanContent.includes('butter chicken') || cleanContent.includes('chicken tikka masala') || cleanContent.includes('murg')) {
          replyText = isHindi
            ? "Authentic Butter Chicken ke liye: Tomatoes ko cashew paste, kasuri methi aur butter ke sath slow-cook karein. Finely strained gravy aur gentle honey touch balance banata hai!"
            : "For velvety Butter Chicken: Strain tomato-cashew gravy through a fine sieve, finish with toasted kasuri methi, butter, and a micro-touch of honey for balance.";
        } else if (cleanContent.includes('dal makhani') || cleanContent.includes('dal') || cleanContent.includes('lentil')) {
          replyText = isHindi
            ? "Dal Makhani Secrets: Urad dal aur Rajma ko kam se kam 12 ghante slow simmer karein. White butter aur Kashmiri chili ka tadka original Dhaba taste deta hai!"
            : "Dal Makhani Secret: Slow simmer black urad dal & kidney beans for 8+ hours. Finish with white butter, fresh cream, and a gentle Kashmiri chili ghee tempering.";
        } else if (cleanContent.includes('dosa') || cleanContent.includes('idli') || cleanContent.includes('chutney')) {
          replyText = isHindi
            ? "Crispy Dosa Batter Tip: Parboiled rice aur Urad dal mein 1/2 tsp fenugreek (methi) seeds mila kar 8-10 ghante ferment karein. Coconut chutney mein mustard & curry leaves ka fresh tadka dein!"
            : "For ultra-crispy Dosa: Add 1/2 tsp fenugreek seeds while soaking rice & urad dal. Ferment for 8-10 hours at warm temperature. Temper coconut chutney with mustard seeds & curry leaves.";
        } else if (cleanContent.includes('substitute') || cleanContent.includes('jagah') || cleanContent.includes('badle') || cleanContent.includes('replace') || cleanContent.includes('egg')) {
          replyText = isHindi
            ? "Ingredient Substitution Guide: Baking mein 1 egg = 1 tbsp ground flaxseed + 3 tbsp water (ya 1/4 cup dahi). Paneer/Cheese ki jagah Tofu, Maida ki jagah Oat/Almond flour use karein!"
            : "Substitution Pro Tips: 1 Egg in baking = 1 tbsp ground flaxseeds mixed with 3 tbsp water (or 1/4 cup yogurt). Replace cream with blended cashews, and maida with oat flour.";
        } else if (cleanContent.includes('protein') || cleanContent.includes('gym') || cleanContent.includes('muscle') || cleanContent.includes('fit')) {
          replyText = isHindi
            ? "High Protein Choices: Grilled Salmon (42g protein), Wagyu Steak (55g protein), Soya Chunks, Paneer/Tofu, aur Boiled Eggs. Humare Meal Planner se apna daily protein budget track karein!"
            : "Top Protein Dishes: Grilled Salmon (42g), Seared Wagyu Steak (55g), Paneer/Tofu Skewers, and Lentil Protein Bowls. Use our Meal Planner tab to auto-calculate daily macros!";
        } else if (cleanContent.includes('calorie') || cleanContent.includes('weight loss') || cleanContent.includes('diet') || cleanContent.includes('fat')) {
          replyText = isHindi
            ? "Weight Loss & Low Calorie Tips: Artisanal Burrata Salad (320 Kcal) ya Air-Fried Tofu/Chicken try karein. Deep frying ki jagah roasting use karein aur dressing mein lemon + olive oil use karein."
            : "For weight management: Opt for low-calorie high-volume meals like Artisanal Burrata Salad (320 Kcal) or Air-Fried protein dishes. Use lemon vinaigrette over heavy cream dressings.";
        } else if (cleanContent.includes('pasta') || cleanContent.includes('pizza') || cleanContent.includes('carbonara') || cleanContent.includes('italian')) {
          replyText = isHindi
            ? "Italian Master Tip: Carbonara mein kabhi cream mat daalein! Egg yolks, Pecorino Romano cheese aur pasta starchy water se natural creamy sauce banayein. Serve with Chianti red wine."
            : "Italian Secret: Never use cream in authentic Carbonara! Emulsify egg yolks, freshly grated Pecorino Romano, and starchy pasta water. Pair with a Chianti or Pinot Grigio.";
        } else if (cleanContent.includes('air fryer') || cleanContent.includes('oven') || cleanContent.includes('baking') || cleanContent.includes('roast')) {
          replyText = isHindi
            ? "Air Fryer & Baking Pro Tip: Air fryer ko 3 min preheat karein. Light oil spray se food crisp banta hai. Baking cakes ke liye room temperature ingredients zaroori hain!"
            : "Air Fryer & Baking Pro Tips: Always preheat your air fryer for 3 mins and use light oil spray for extra crispiness. For baking, ensure eggs & butter are at room temperature.";
        } else if (cleanContent.includes('chai') || cleanContent.includes('tea') || cleanContent.includes('coffee') || cleanContent.includes('drink')) {
          replyText = isHindi
            ? "Masala Chai Secret: Ginger aur Cardamom ko paani boil hote hi kuut kar daalein, doodh ke sath nahi. Doodh daalne ke baad low flame par 3 min simmer karein perfect kadak chai ke liye!"
            : "Masala Chai Perfection: Crushed ginger, cardamom & cloves should boil in water first before adding tea leaves & milk. Simmer on low heat for 3 mins for rich aromatics.";
        } else if (cleanContent.includes('spices') || cleanContent.includes('masala') || cleanContent.includes('tadka')) {
          replyText = isHindi
            ? "Tadka & Spices Secret: Whole spices (Jeera, Mustard, Bay leaf) ko hamesha hot Ghee/Oil mein 15 seconds crackle hone dein taaki essential oils release hon. Kashmiri chili color ke liye best hai!"
            : "Tempering Mastery: Bloom whole spices (cumin, mustard, cardamom) in hot Ghee/Oil for 15 seconds to release volatile oils before adding onions or tomatoes.";
        } else if (cleanContent.includes('knife') || cleanContent.includes('chaku') || cleanContent.includes('cut') || cleanContent.includes('chopping')) {
          replyText = isHindi
            ? "Kitchen Tools Tip: Sabziyon ke liye 6.5-inch Japanese Nakiri knife ya 8-inch Damascus Chef Knife best hai. Pinch grip se knife pakdein safe & fast chopping ke liye!"
            : "Knife Mastery: Use an 8-inch Damascus Chef Knife for general prep or a Japanese Nakiri for vegetables. Maintain blade sharpness at 15 degrees with a ceramic honing rod.";
        } else if (cleanContent.includes('subah') || cleanContent.includes('breakfast') || cleanContent.includes('nashta')) {
          replyText = isHindi
            ? "Gourmet Nashta Idea: Avocado Toast with Poached Egg, Sourdough Burrata, ya Oats Chela with Coconut Chutney try karein! High energy aur clean nutrition ke liye perfect hai."
            : "Elevated Breakfast: Try Sous-Vide Eggs on sourdough, Avocado Toast with microgreens, or Artisanal Burrata with heirloom tomatoes for sustained morning energy.";
        } else if (cleanContent.includes('plating') || cleanContent.includes('art') || cleanContent.includes('decorate')) {
          replyText = "Plating is visual poetry! Follow the rule of odds (3 or 5 elements), use offset tweezers for microgreens, create vertical height, and use sauce sweeps or balsamic pearls for contrast.";
        } else if (isHindi) {
          replyText = "Namaste! Main aapka Kitchen Hub Master Chef & Sommelier AI hoon. Aap mujhse recipes, masala secrets, ingredient substitutes, weight loss diet, ya wine pairings ke baare mein kuch bhi pooch sakte hain!";
        }

        const agentMsg: Message = {
          senderId: 'sommelier',
          receiverId: 'user-current',
          content: replyText,
          createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, agentMsg]);
      }, 500);
    };

  return (
    <AppContext.Provider value={{
      currentUser,
      isLoggedIn,
      showAuthModal,
      recipes,
      classes,
      marketplaceTools,
      forumPosts,
      messages,
      usersList,
      chefsList,
      pendingChefsList,
      currentView,
      activeRecipeId,
      activeClassId,
      theme,
      groceryList,
      cartItems,
      mealPlan,
      toast,
      setCurrentView,
      setActiveRecipeId,
      setActiveClassId,
      setShowAuthModal,
      toggleTheme,
      updateProfile,
      saveRecipe,
      submitReview,
      uploadCookedVersion,
      createForumPost,
      replyToPost,
      upvotePost,
      sendMessage,
      login,
      logout,
      addRecipe,
      addClass,
      applyAsChef,
      approveChef,
      deactivateChef,
      deleteUser,
      deleteRecipe,
      deleteClass,
      registerUser,
      addToGroceryList,
      removeFromGroceryList,
      clearGroceryList,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      showToast,
      addToMealPlan,
      removeFromMealPlan,
      exportMealPlanToGrocery,
      activeDelivery,
      placeDeliveryOrder,
      cancelDelivery
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppContextProvider');
  return context;
};
