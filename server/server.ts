import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import Mongoose Models
import User from './models/User';
import Recipe from './models/Recipe';
import Class from './models/Class';
import MarketplaceTool from './models/MarketplaceTool';
import Forum from './models/Forum';
import Message from './models/Message';
import { INITIAL_RECIPES } from '../src/assets/recipesData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/epicurean';
console.log('Connecting to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    await seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// --- SEED DATABASE ROUTINE ---
async function seedDatabase() {
  try {
    // Clear and check collections
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Class.deleteMany({});
    await MarketplaceTool.deleteMany({});
    await Forum.deleteMany({});
    await Message.deleteMany({});

    console.log('Database collections cleared. Seeding initial culinary data...');

    // 1. Seed Marketplace Tools
    const INITIAL_TOOLS = [
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
      }
    ];
    await MarketplaceTool.insertMany(INITIAL_TOOLS);

    // 2. Seed Recipes
    await Recipe.insertMany(INITIAL_RECIPES);

    // 3. Seed Users
    const INITIAL_USERS = [
      {
        id: 'user-current',
        name: 'Alex Rivera',
        email: 'alex@kitchenhub.com',
        password: 'password',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bio: 'Culinary explorer and plating designer. Obsessed with molecular gastronomy, perfect steak crusts, and sourdough baking.',
        level: 'Home Chef',
        savedRecipes: ['wagyu-ribeye'],
        cookedVersions: [
          {
            recipeId: 'burrata-salad',
            recipeTitle: 'Artisanal Burrata with Heirloom Tomatoes',
            image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=80',
            comment: 'My balsamic pearls turned out beautiful! So sweet and tangy.',
            date: '2026-07-18'
          }
        ],
        badges: ['Plating Artist', 'Knife Specialist', 'Balsamic Wizard'],
        role: 'user'
      },
      {
        id: 'user-elena',
        name: 'Elena Chen',
        email: 'elena@kitchenhub.com',
        password: 'password',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        bio: 'Professional pastry chef based in Portland. Specializes in modern French baking, sugar work, and chocolate designs.',
        level: 'Master Chef',
        savedRecipes: ['lemon-tart'],
        cookedVersions: [],
        badges: ['Patisserie Guru', 'Sugar Artist'],
        role: 'user'
      },
      {
        id: 'user-admin',
        name: 'System Administrator',
        email: 'admin@kitchenhub.com',
        password: 'admin123',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        bio: 'Kitchen Hub Chief Administrator. Access to moderator tools and registrations approval panel.',
        level: 'Master Chef',
        savedRecipes: [],
        cookedVersions: [],
        badges: ['Grand Architect', 'Moderator Badge'],
        role: 'admin'
      },
      {
        id: 'chef-jean-luc',
        name: 'Chef Jean-Luc',
        email: 'jeanluc@kitchenhub.com',
        password: 'chef123',
        avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
        bio: 'Classical French Cuisine Master. 15 years experience in Parisian restaurants.',
        level: 'Master Chef',
        savedRecipes: [],
        cookedVersions: [],
        badges: ['Michelin Starred', 'Sauce Master'],
        role: 'chef'
      },
      {
        id: 'chef-melissa-thorne',
        name: 'Chef Melissa Thorne',
        email: 'melissa@kitchenhub.com',
        password: 'chef123',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bio: 'Pastry designer & food stylist. Specializes in sugar glass and deconstructed desserts.',
        level: 'Master Chef',
        savedRecipes: [],
        cookedVersions: [],
        badges: ['Patisserie Guru', 'Sugar Artist'],
        role: 'chef'
      },
      {
        id: 'chef-antoine-laurent',
        name: 'Chef Antoine Laurent',
        email: 'antoine@kitchenhub.com',
        password: 'chef123',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: 'Gastronomy chemist and instructor at the Cordon Bleu.',
        level: 'Master Chef',
        savedRecipes: [],
        cookedVersions: [],
        badges: ['Emulsion Specialist'],
        role: 'chef'
      }
    ];
    await User.insertMany(INITIAL_USERS);

    // 4. Seed Classes
    const INITIAL_CLASSES = [
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
      },
      {
        id: 'french-sauces',
        title: 'French Mother Sauces & Emulsions',
        description: 'Unlock the secrets of Béchamel, Velouté, Espagnole, Tomato, and Hollandaise. Create flawless emulsion sauces without breaking.',
        instructor: 'Chef Antoine Laurent',
        instructorBio: 'Instructor at the Cordon Bleu. Passionate about culinary chemistry and historical sauces.',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        duration: '1h 30m',
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=2n5w4cK5R-U',
        rating: 4.8,
        studentsCount: 2210
      },
      {
        id: 'pastry-stabilizers',
        title: 'Modernist Pastry: Stabilizers & Gels',
        description: 'Learn the chemistry of hydrocolloids to create silky whipped white chocolate ganache, fluid fruit gels, and aerated sponge cake structures.',
        instructor: 'Chef Melissa Thorne',
        instructorBio: 'Culinary stylist and author of "Plating Perfection". Known for her gorgeous minimalist photography.',
        instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        duration: '1h 10m',
        level: 'Expert',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=F3xO2L7hCg0',
        rating: 4.9,
        studentsCount: 1420
      },
      {
        id: 'sous-vide-meat',
        title: 'Sous-Vide Cooking: Precision Temperature Control',
        description: 'Master core time and temperature charts for cooking beef, poultry, vegetables, and smooth custard jars using immersion circulators.',
        instructor: 'Chef Jean-Pierre',
        instructorBio: 'Classical French chef with 20+ years of kitchen leadership in Michelin-starred Parisian restaurants.',
        instructorAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
        duration: '50 mins',
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=0kFj23yOqHk',
        rating: 4.8,
        studentsCount: 1890
      }
    ];
    await Class.insertMany(INITIAL_CLASSES);

    // 5. Seed Forum Posts
    const INITIAL_FORUM = [
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
      },
      {
        id: 'post-2',
        authorId: 'user-current',
        authorName: 'Alex Rivera',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        title: 'Smoking Duck Breast: Cherry vs. Applewood',
        content: 'I find applewood is a bit too mild for duck\'s gamey flavor. Cherrywood gives a gorgeous mahogany-red hue to the skin and a rich, sweet smoke profile that cuts through the duck fat beautifully. What is your experience?',
        tags: ['Smoking', 'Duck', 'Flavor Profiling'],
        upvotes: 12,
        votedBy: [],
        createdAt: '2026-07-19T08:15:00Z',
        replies: []
      }
    ];
    await Forum.insertMany(INITIAL_FORUM);

    // 6. Seed Messages
    const INITIAL_MESSAGES = [
      { senderId: 'user-elena', receiverId: 'user-current', content: 'Hey Alex! Your Burrata plate looks spectacular. Did you make the balsamic caviar using Agar-Agar?', createdAt: new Date(Date.now() - 1000 * 60 * 10) }
    ];
    await Message.insertMany(INITIAL_MESSAGES);

    console.log('Database successfully seeded.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// --- API ENDPOINT ROUTES ---

// 1. User/Chef Routes
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanedEmail = email.trim().toLowerCase();
    
    const user = await User.findOne({ email: { $regex: new RegExp(`^${cleanedEmail}$`, 'i') } });
    if (!user) {
      return res.status(404).json({ error: 'No account matches this email.' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password for this user profile.' });
    }
    
    // Check if chef application is pending
    if (user.role === 'chef' && user.badges.includes('Chef Applicant')) {
      return res.status(403).json({ error: 'Your Chef credentials review is still pending Administrator activation.' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, role, bio, avatar } = req.body;
    const cleanedEmail = email.trim().toLowerCase();
    
    // Check if email already exists
    const existing = await User.findOne({ email: { $regex: new RegExp(`^${cleanedEmail}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    
    const isChef = role === 'chef';
    const id = isChef ? `pending-${Date.now()}` : `user-${Date.now()}`;
    const badges = isChef ? ['Chef Applicant'] : ['New Member'];
    
    const newUser = new User({
      id,
      name: name || 'Anonymous Cook',
      email: cleanedEmail,
      password: password || 'password',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bio: bio || 'Kitchen Hub member exploring culinary arts.',
      level: isChef ? 'Master Chef' : 'Novice Cook',
      savedRecipes: [],
      cookedVersions: [],
      badges,
      role: role || 'user'
    });
    
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.get('/api/users/current', async (req, res) => {
  try {
    const id = String(req.query.id || 'user-current');
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ error: 'Current user not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/users/current', async (req, res) => {
  try {
    const id = String(req.query.id || 'user-current');
    const updated = await User.findOneAndUpdate({ id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.post('/api/users/current/saved-recipes', async (req, res) => {
  try {
    const { recipeId } = req.body;
    const id = String(req.query.id || 'user-current');
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const idx = user.savedRecipes.indexOf(recipeId);
    if (idx > -1) {
      user.savedRecipes.splice(idx, 1);
    } else {
      user.savedRecipes.push(recipeId);
    }
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle saved recipe' });
  }
});

// 2. Recipe Routes
app.get('/api/recipes', async (req, res) => {
  try {
    const list = await Recipe.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ id: req.params.id });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});

// Submit review
app.post('/api/recipes/:id/reviews', async (req, res) => {
  try {
    const { reviewerName, rating, comment } = req.body;
    const recipe = await Recipe.findOne({ id: req.params.id });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    recipe.reviews.push({
      reviewerName,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    });
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Upload cooked version
app.post('/api/recipes/:id/cooked', async (req, res) => {
  try {
    const { userName, userAvatar, image, comment } = req.body;
    const recipe = await Recipe.findOne({ id: req.params.id });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const newVersion = {
      userName,
      userAvatar,
      image,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    recipe.cookedVersions.push(newVersion);
    await recipe.save();

    // Also append to current user's profile cooked versions log
    const user = await User.findOne({ id: 'user-current' });
    if (user) {
      user.cookedVersions.push({
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        image,
        comment,
        date: new Date().toISOString().split('T')[0]
      });
      await user.save();
    }

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload cooked version' });
  }
});

// 3. Learning Academy Classes
app.get('/api/classes', async (req, res) => {
  try {
    const list = await Class.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// 4. Marketplace Tools
app.get('/api/marketplace-tools', async (req, res) => {
  try {
    const list = await MarketplaceTool.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch marketplace tools' });
  }
});

// 5. Discussion Forum
app.get('/api/forum', async (req, res) => {
  try {
    const list = await Forum.find({}).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forum discussions' });
  }
});

app.post('/api/forum', async (req, res) => {
  try {
    const newPost = new Forum(req.body);
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post discussion' });
  }
});

app.put('/api/forum/:id', async (req, res) => {
  try {
    const updated = await Forum.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// 6. Direct Messaging (Chat)
app.get('/api/messages/:userA/:userB', async (req, res) => {
  try {
    const { userA, userB } = req.params;
    const history = await Message.find({
      $or: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA }
      ]
    }).sort({ createdAt: 1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    await newMsg.save();
    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Serve static files from the React frontend build
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for React Router routing
app.get('*all', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Express Kitchen Hub Server running on port ${PORT}`);
});
