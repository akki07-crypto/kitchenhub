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
  tools: string[];
  reviews: IRecipeReview[];
  cookedVersions: IRecipeCookedVersion[];
}

export const INITIAL_RECIPES: IRecipe[] = [
  {
    id: 'wagyu-ribeye',
    title: 'Pan-Seared Wagyu Ribeye with Black Truffle Butter',
    chef: 'Chef Jean-Luc',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    description: 'An ultra-premium Wagyu ribeye steak seared to medium-rare perfection and topped with a luxurious, homemade black truffle butter.',
    prepTime: '25 mins',
    difficulty: 'Expert',
    calories: 920,
    protein: '65g',
    carbs: '4g',
    fat: '72g',
    category: 'High Protein',
    tags: ['High Protein', 'High Calorie', 'Chef Special'],
    videoUrl: 'https://www.youtube.com/watch?v=AmC9HykerUk',
    ingredients: [
      '16oz A5 Wagyu Ribeye Steak (room temperature)',
      '2 tbsp Premium Black Truffle Paste',
      '4 oz Unsalted French Butter (softened)',
      '3 sprigs Fresh Rosemary',
      '4 cloves Garlic (smashed)',
      'Fleur de Sel (coarse sea salt)',
      'Freshly cracked black pepper'
    ],
    steps: [
      'Take the Wagyu steak out of the refrigerator 30 minutes before cooking to reach room temperature.',
      'Whip softened butter with truffle paste and roll into a log using plastic wrap, then chill until firm.',
      'Season steak generously with coarse Fleur de Sel and freshly cracked black pepper on all sides.',
      'Preheat a cast-iron skillet on high heat until smoking. Sear the Wagyu steak for 2 minutes on each side.',
      'Add rosemary, garlic, and a slice of truffle butter to the skillet. Tilt the pan and spoon melted butter over the steak for 1 minute.',
      'Transfer the steak to a warm plate and let it rest for 5-8 minutes. Top with another slice of truffle butter before slicing.'
    ],
    tools: ['Smithey Cast Iron Skillet (12-inch)', 'Mercer Culinary Offset Plating Tweezers'],
    reviews: [
      { reviewerName: 'Gordon R.', rating: 5, comment: 'Incredible marbling and absolute perfection with the truffle butter basting technique.', date: '2026-07-15' },
      { reviewerName: 'Elena Chen', rating: 4, comment: 'Insanely rich but absolutely delicious. The cast iron skillet recommendation was key!', date: '2026-07-18' }
    ],
    cookedVersions: [
      { userName: 'Marcus Vance', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', comment: 'Nailed the medium rare! Truffle butter smell was out of this world.', date: '2026-07-18' }
    ]
  },
  {
    id: 'lemon-tart',
    title: 'Deconstructed Meyer Lemon Tart with Gold Leaf',
    chef: 'Chef Melissa Thorne',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=1200&auto=format&fit=crop&q=80',
    description: 'A modern, sophisticated pastry plating featuring silky Meyer lemon curd, toasted Italian meringue peaks, buttery sablé crumble, and edible gold leaf accents.',
    prepTime: '60 mins',
    difficulty: 'Expert',
    calories: 480,
    protein: '8g',
    carbs: '58g',
    fat: '24g',
    category: 'Sweet Dessert',
    tags: ['Sweet Dessert', 'Chef Special'],
    videoUrl: 'https://www.youtube.com/watch?v=F3xO2L7hCg0',
    ingredients: [
      '1/2 cup Fresh Meyer Lemon Juice',
      '3 large Egg Yolks',
      '1/2 cup Superfine Sugar',
      '6 tbsp Unsalted Butter (cubed)',
      'Italian Meringue: 2 Egg Whites, 1/2 cup Sugar, 2 tbsp Water',
      'Sablé Crumble: 1 cup Flour, 1/3 cup Powdered Sugar, 8 tbsp Cold Butter',
      'Edible Gold Leaf sheets',
      'Fresh micro-mint leaves'
    ],
    steps: [
      'Lemon Curd: Whisk lemon juice, yolks, and sugar in a double boiler until thickened. Whisk in cubed butter one by one. Strain and chill.',
      'Sablé Crumble: Rub flour, sugar, and cold butter until it resembles breadcrumbs. Bake at 350°F (175°C) for 15 minutes until golden.',
      'Meringue: Whip egg whites to soft peaks. Heat sugar and water to 240°F (115°C) and slowly pour into whipping whites. Whip until glossy and cool.',
      'Plating: Spoon lemon curd in a graceful curve. Pipe meringue peaks and toast with a kitchen torch. Scatter crumble, micro-mint, and delicate gold leaf.'
    ],
    tools: ['Iwatani Pro Culinary Torch', 'Mercer Culinary Offset Plating Tweezers'],
    reviews: [
      { reviewerName: 'Sarah K.', rating: 5, comment: 'Plated this for a dinner party and my guests were absolutely blown away. Elegant recipe.', date: '2026-07-12' }
    ],
    cookedVersions: []
  },
  {
    id: 'saffron-halibut',
    title: 'Sous-Vide Atlantic Halibut in Saffron Broth',
    chef: 'Chef Antoine Laurent',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&auto=format&fit=crop&q=80',
    description: 'Delicately poached halibut in a water bath at 122°F, served in an aromatic saffron, fennel, and white wine reduction broth.',
    prepTime: '40 mins',
    difficulty: 'Medium',
    calories: 380,
    protein: '42g',
    carbs: '12g',
    fat: '18g',
    category: 'High Protein',
    tags: ['High Protein', 'Seafood'],
    videoUrl: 'https://www.youtube.com/watch?v=0kFj23yOqHk',
    ingredients: [
      '2 Atlantic Halibut Fillets (6oz each)',
      '1 tbsp Extra Virgin Olive Oil',
      '1 pinch Saffron Threads',
      '1 small Fennel Bulb (thinly sliced)',
      '1/2 cup Dry White Wine',
      '1 cup Seafood Stock',
      '2 tbsp Heavy Cream',
      'Microgreens for garnish'
    ],
    steps: [
      'Season halibut fillets with sea salt and olive oil, then vacuum seal.',
      'Cook in the sous-vide water bath at 122°F (50°C) for exactly 30 minutes.',
      'Saffron Broth: Sauté fennel in olive oil. Deglaze with white wine. Add stock and saffron. Simmer until reduced by half, then stir in heavy cream.',
      'Plating: Pour warm saffron broth in a shallow coupe plate. Place the halibut in the center and decorate with microgreens.'
    ],
    tools: ['Anova Precision Cooker Pro', 'Bernardaud Porcelain Saffron Coupe Plate'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'burrata-salad',
    title: 'Artisanal Burrata with Heirloom Tomatoes & Balsamic Pearls',
    chef: 'Chef Melissa Thorne',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=1200&auto=format&fit=crop&q=80',
    description: 'A vibrant, refreshing starter showcasing creamy Italian burrata, heirloom tomatoes, fresh basil oil, and molecular balsamic pearls.',
    prepTime: '15 mins',
    difficulty: 'Easy',
    calories: 320,
    protein: '18g',
    carbs: '14g',
    fat: '22g',
    category: 'Vegetarian',
    tags: ['Vegetarian', 'Easy Prep'],
    videoUrl: 'https://www.youtube.com/watch?v=Xh7LkiG-cE4',
    ingredients: [
      '2 balls Fresh Italian Burrata',
      '3 Heirloom Tomatoes (sliced)',
      '1/2 cup Fresh Basil Leaves',
      '1/2 cup Extra Virgin Olive Oil',
      '1/4 cup Balsamic Vinegar',
      '1 tsp Agar-Agar powder (for molecular pearls)',
      '1 cup Cold Vegetable Oil (chilled in freezer)',
      'Maldon sea salt flakes'
    ],
    steps: [
      'Balsamic Caviar: Heat balsamic vinegar with agar-agar until boiling. Using a dropper, drip warm balsamic into the cold vegetable oil to form spheres. Rinse pearls with cold water.',
      'Basil Oil: Blanch basil leaves, then blend with olive oil and strain through a cheesecloth.',
      'Assembly: Arrange heirloom tomato slices on the plate, place burrata in the center. Drizzle basil oil, sprinkle sea salt, and top with balsamic pearls.'
    ],
    tools: ['Mercer Culinary Offset Plating Tweezers'],
    reviews: [
      { reviewerName: 'Alice W.', rating: 5, comment: 'Making the balsamic pearls was incredibly satisfying! Super fun starter.', date: '2026-07-16' }
    ],
    cookedVersions: [
      {
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80',
        comment: 'My balsamic pearls turned out beautiful! So sweet and tasty.',
        date: '2026-07-18'
      }
    ]
  },
  {
    id: 'duck-breast',
    title: 'Pan-Seared Duck Breast with Cherry-Port Reduction',
    chef: 'Chef Jean-Luc',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=1200&auto=format&fit=crop&q=80',
    description: 'Perfect bias-cut pan-seared duck breast with crisp scored skin, served with a sweet and tart port wine and balsamic cherry reduction.',
    prepTime: '35 mins',
    difficulty: 'Medium',
    calories: 620,
    protein: '52g',
    carbs: '16g',
    fat: '38g',
    category: 'High Protein',
    tags: ['High Protein', 'Poultry'],
    videoUrl: 'https://www.youtube.com/watch?v=2n5w4cK5R-U',
    ingredients: [
      '2 Magret Duck Breasts',
      '1/2 cup Fresh Sweet Cherries (pitted and halved)',
      '1/4 cup Ruby Port Wine',
      '1 tbsp Aged Balsamic Vinegar',
      '1 sprig Fresh Thyme',
      'Fleur de Sel (coarse sea salt)',
      'Freshly cracked black pepper'
    ],
    steps: [
      'Score the duck breast skin in a tight crosshatch pattern, being careful not to cut into the meat.',
      'Place duck breasts skin-side down in a cold cast-iron skillet. Turn heat to medium-low to render fat for 8-10 minutes. Pour off excess fat.',
      'Flip duck breasts and cook for 3-4 minutes on the flesh side until medium-rare (internal temp 135°F). Rest for 5-8 minutes.',
      'Sauce: Deglaze the skillet with port wine and balsamic vinegar, scraping up brown bits. Add cherries and thyme. Simmer until reduced by half.',
      'Slice duck breast on a bias, season with Fleur de Sel, and spoon warm cherry-port reduction over the top.'
    ],
    tools: ['Smithey Cast Iron Skillet (12-inch)', 'Yaxell Super Gou Damascus Chef Knife (8-inch)'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'deconstructed-tiramisu',
    title: 'Deconstructed Tiramisu with Espresso Caviar',
    chef: 'Chef Melissa Thorne',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200&auto=format&fit=crop&q=80',
    description: 'A modern plate composition featuring light mascarpone cream, espresso-soaked ladyfingers, and molecular gastronomy espresso caviar pearls.',
    prepTime: '50 mins',
    difficulty: 'Expert',
    calories: 450,
    protein: '7g',
    carbs: '54g',
    fat: '22g',
    category: 'Sweet Dessert',
    tags: ['Sweet Dessert'],
    videoUrl: 'https://www.youtube.com/watch?v=F3xO2L7hCg0',
    ingredients: [
      '1 cup Fresh Mascarpone Cheese',
      '1/2 cup Organic Heavy Whipping Cream',
      '1/4 cup Powdered Sugar',
      'Ladyfinger Biscuits',
      'Espresso Caviar: 1/2 cup Strong Hot Espresso, 1/2 tsp Agar-Agar Powder, 1 cup Ice-Cold Canola Oil (chilled in freezer)'
    ],
    steps: [
      'Whisk mascarpone cheese, heavy cream, and powdered sugar until stiff peaks form. Transfer to a piping bag fitted with a round tip and chill.',
      'Espresso Caviar: Whisk hot espresso and agar-agar in a saucepan and bring to a boil for 30 seconds. Drip warm espresso mixture into the chilled oil to form pearls. Strain and rinse with water.',
      'Assembly: Pipe elegant dollops of mascarpone cream. Arrange coffee-soaked ladyfingers. Spoon espresso caviar pearls over the dish and dust with cocoa powder.'
    ],
    tools: ['Mercer Culinary Offset Plating Tweezers', 'KitchenAid Commercial 8-Quart Mixer'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'scallops-pea-puree',
    title: 'Pan-Seared Diver Scallops with Minted Pea Purée',
    chef: 'Chef Jean-Luc',
    image: 'https://images.unsplash.com/photo-1532636875304-0c8fe1197e14?w=1200&auto=format&fit=crop&q=80',
    description: 'Perfectly caramelized sea scallops set on a vibrant, velvety minted sweet pea purée, finished with crispy prosciutto shards.',
    prepTime: '30 mins',
    difficulty: 'Medium',
    calories: 340,
    protein: '36g',
    carbs: '14g',
    fat: '12g',
    category: 'High Protein',
    tags: ['High Protein', 'Seafood'],
    videoUrl: 'https://www.youtube.com/watch?v=XzWzKz60o_Y',
    ingredients: [
      '6 Fresh Jumbo Diver Scallops',
      '2 cups Sweet Green Peas (fresh or frozen)',
      '2 tbsp Fresh Mint Leaves',
      '2 tbsp Heavy Cream',
      '4 slices Prosciutto di Parma',
      '2 tbsp Clarified Butter',
      'Sea Salt and White Pepper'
    ],
    steps: [
      'Crisp Prosciutto: Bake prosciutto slices between two baking sheets at 375°F for 12 minutes until crispy. Break into shards.',
      'Pea Purée: Boil peas for 3 minutes until bright green. Blend with cream, mint, salt, and pepper until absolutely smooth. Strain.',
      'Searing: Pat scallops completely dry with paper towels. Season with salt. Heat clarified butter in a stainless steel pan until smoking.',
      'Sear scallops for 90 seconds on one side without moving to form a deep golden crust. Flip and cook for 30 seconds. Drain on paper towels.',
      'Plating: Spoon warm pea purée on the plate. Place scallops on top and decorate with crispy prosciutto shards.'
    ],
    tools: ['Mercer Culinary Offset Plating Tweezers'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'caprese-injection',
    title: 'Modernist Caprese Injection Spheres',
    chef: 'Chef Antoine Laurent',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=1200&auto=format&fit=crop&q=80',
    description: 'A molecular gastonomy interpretation of the Caprese salad: tomato water spheres enclosing liquefied mozzarella cores.',
    prepTime: '45 mins',
    difficulty: 'Expert',
    calories: 180,
    protein: '10g',
    carbs: '8g',
    fat: '11g',
    category: 'Vegetarian',
    tags: ['Vegetarian', 'Molecular'],
    videoUrl: 'https://www.youtube.com/watch?v=Xh7LkiG-cE4',
    ingredients: [
      '2 cups Clarified Tomato Water',
      '1/2 cup Liquefied Fresh Mozzarella Cream',
      '2g Sodium Alginate',
      '5g Calcium Lactate Gluconate',
      '1 cup Distilled Water',
      'Fresh Basil sprigs',
      'Aged Balsamic vinegar reduction'
    ],
    steps: [
      'Prepare alginate bath by dissolving sodium alginate in distilled water. Let sit for 1 hour to release bubbles.',
      'Mix tomato water with calcium lactate. Freeze mozzarella cream in tiny semi-spherical silicone molds.',
      'Insert frozen mozzarella cores into tomato water spoonfuls, then submerge in the sodium alginate bath for 2 minutes.',
      'Remove spheres from the bath, rinse in clean water, and plate with fresh basil oil and a drop of rich balsamic reduction.'
    ],
    tools: ['Mercer Culinary Offset Plating Tweezers'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'beef-wellington',
    title: 'Classic Beef Wellington with Foie Gras Duxelles',
    chef: 'Chef Jean-Luc',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    description: 'Tender beef tenderloin wrapped in golden, flaky puff pastry lined with rich prosciutto and savory wild mushroom and foie gras duxelles.',
    prepTime: '90 mins',
    difficulty: 'Expert',
    calories: 890,
    videoUrl: 'https://www.youtube.com/watch?v=Csk2TeeVqC0',
    ingredients: [
      '2 lb Center-Cut Beef Tenderloin Fillet',
      '1 lb Mixed Wild Mushrooms (finely chopped)',
      '2 oz Foie Gras pate',
      '1 sheet Pre-rolled Puff Pastry',
      '8 slices Prosciutto',
      '2 tbsp English Mustard',
      '2 Egg Yolks (beaten for glaze)',
      'Salt and pepper'
    ],
    steps: [
      'Sear the beef tenderloin on all sides in a hot pan until colored but completely raw inside. Brush with English mustard.',
      'Sauté chopped mushrooms until completely dry (duxelles). Stir in foie gras pâté and let cool.',
      'Layer plastic wrap. Arrange prosciutto slices overlapping. Spread mushroom-foie gras duxelles evenly over prosciutto.',
      'Place beef in center and roll tightly into a cylinder. Chill in refrigerator for 30 minutes to firm up.',
      'Roll out puff pastry. Unwrap beef and wrap in pastry, sealing edges with egg wash. Score decorative lines on pastry.',
      'Glaze with egg yolk. Bake at 400°F (200°C) for 30 minutes until golden brown. Rest for 10 minutes before slicing.'
    ],
    tools: ['Yaxell Super Gou Damascus Chef Knife (8-inch)', 'KitchenAid Commercial 8-Quart Mixer'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'beet-salad-mousse',
    title: 'Roasted Beet Trio with Goat Cheese Mousse',
    chef: 'Chef Melissa Thorne',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80',
    description: 'Golden, red, and candy-striped roasted beets paired with a light whipped French goat cheese mousse and candied walnuts.',
    prepTime: '45 mins',
    difficulty: 'Medium',
    calories: 290,
    videoUrl: 'https://www.youtube.com/watch?v=F3xO2L7hCg0',
    ingredients: [
      '6 Mixed Heirloom Beets',
      '4 oz French Goat Cheese',
      '2 tbsp Heavy Cream (whipped)',
      '1/2 cup Walnut Halves',
      '1/4 cup Maple Syrup',
      '2 tbsp Sherry Vinaigrette',
      'Micro-greens for plating'
    ],
    steps: [
      'Wrap beets in foil and roast at 400°F for 45 minutes until tender. Peel and slice into geometric wedges.',
      'Whip goat cheese with heavy cream until light and fluffy. Transfer to a pastry piping bag.',
      'Candied Walnuts: Cook walnut halves with maple syrup in a pan until sticky and caramelized. Cool on parchment.',
      'Assemble: Pipe goat cheese mousse in elegant stars, plate roasted beets overlapping, scatter candied walnuts, and garnish with vinaigrette.'
    ],
    tools: ['Mercer Culinary Offset Plating Tweezers'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'lobster-sabayon',
    title: 'Butter-Poached Lobster Tail with Saffron Sabayon',
    chef: 'Chef Antoine Laurent',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&auto=format&fit=crop&q=80',
    description: 'Succulent lobster tail poached gently in butter, served alongside an airy, saffron-infused champagne sabayon sauce.',
    prepTime: '40 mins',
    difficulty: 'Expert',
    calories: 520,
    videoUrl: 'https://www.youtube.com/watch?v=0kFj23yOqHk',
    ingredients: [
      '2 Cold-Water Lobster Tails (shelled)',
      '8 oz European Butter (unsalted)',
      '3 Egg Yolks',
      '1/4 cup Champagne',
      '1 pinch Saffron Threads',
      'Salt and lemon juice'
    ],
    steps: [
      'Butter Poach: Melt butter in a small pot over low heat until it reaches 140°F (60°C). Submerge lobster tails and cook for 12 minutes.',
      'Sabayon: Whisk egg yolks, champagne, and saffron in a double boiler continuously until thick, creamy, and doubled in volume.',
      'Season sabayon with salt and a squeeze of fresh lemon juice.',
      'Plate the poached lobster tail, spoon warm saffron sabayon alongside, and garnish with fine microgreens.'
    ],
    tools: ['Anova Precision Cooker Pro', 'Bernardaud Porcelain Saffron Coupe Plate'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'salmon-sous-vide',
    title: 'Sous-Vide King Salmon with Dill Emulsion',
    chef: 'Chef Antoine Laurent',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&auto=format&fit=crop&q=80',
    description: 'Perfectly tender salmon cooked to a precise 115°F core temperature, served over a bright green, creamy dill oil emulsion.',
    prepTime: '30 mins',
    difficulty: 'Medium',
    calories: 410,
    videoUrl: 'https://www.youtube.com/watch?v=0kFj23yOqHk',
    ingredients: [
      '2 wild King Salmon Fillets (6oz each)',
      '1/2 cup Fresh Dill Leaves',
      '1/2 cup Neutral Grapeseed Oil',
      '1 Egg Yolk',
      '1 tsp Dijon Mustard',
      'Lemon zest and Fleur de Sel'
    ],
    steps: [
      'Vacuum seal salmon fillets with olive oil and a pinch of salt.',
      'Poach in sous-vide water circulator at 115°F (46°C) for 25 minutes.',
      'Dill Oil: Blend dill with grapeseed oil on high speed until vibrant green. Strain through a coffee filter.',
      'Emulsion: Whisk egg yolk, Dijon mustard, and lemon juice. Slowly drizzle in dill oil to emulsify into a rich green mayonnaise.',
      'Place salmon gently on the plate, pipe dots of dill emulsion, and sprinkle with lemon zest.'
    ],
    tools: ['Anova Precision Cooker Pro', 'Bernardaud Porcelain Saffron Coupe Plate'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'lamb-chops-pistachio',
    title: 'Pistachio-Crusted Chops of Lamb with Blackberry Jus',
    chef: 'Chef Jean-Luc',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=1200&auto=format&fit=crop&q=80',
    description: 'Double-bone lamb chops coated in honey mustard and crushed Sicilian pistachios, served with a tart blackberry pan reduction.',
    prepTime: '40 mins',
    difficulty: 'Medium',
    calories: 780,
    videoUrl: 'https://www.youtube.com/watch?v=AmC9HykerUk',
    ingredients: [
      '1 Rack of Lamb (cut into double chops)',
      '1 cup Raw Pistachios (finely crushed)',
      '3 tbsp English Mustard',
      '2 tbsp Organic Honey',
      '1 cup Fresh Blackberries',
      '1/2 cup Beef Stock',
      '1 sprig Rosemary'
    ],
    steps: [
      'Sear lamb chops in a smoking skillet for 1 minute on each side to caramelize. Let cool slightly.',
      'Mix mustard and honey. Brush the mixture over the seared lamb chops.',
      'Roll seared chops in crushed pistachios until fully coated. Bake at 375°F for 12 minutes for medium-rare.',
      'Reduction: In the same pan, cook blackberries and rosemary. Add beef stock and simmer until thickened. Strain.',
      'Serve chops standing tall, drizzled with blackberry reduction.'
    ],
    tools: ['Smithey Cast Iron Skillet (12-inch)', 'Yaxell Super Gou Damascus Chef Knife (8-inch)'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'sea-bass-tuile',
    title: 'Chilean Sea Bass with Squid Ink Crisps',
    chef: 'Chef Melissa Thorne',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&auto=format&fit=crop&q=80',
    description: 'Buttery pan-roasted Chilean sea bass crowned with an architectural, lacy black squid ink tuile biscuit.',
    prepTime: '30 mins',
    difficulty: 'Expert',
    calories: 450,
    videoUrl: 'https://www.youtube.com/watch?v=0kFj23yOqHk',
    ingredients: [
      '2 Chilean Sea Bass Fillets (6oz each)',
      'Tuile Batter: 80g Water, 10g Flour, 30g Vegetable Oil, 1 tsp Squid Ink',
      '2 tbsp Olive Oil',
      '1 Lemon',
      'Salicornia (sea beans) for garnish'
    ],
    steps: [
      'Squid Ink Tuile: Whisk water, flour, vegetable oil, and squid ink until smooth. Pour batter into a dry non-stick skillet on medium-high.',
      'The water steam will form a beautiful lacy mesh biscuit as it dries. Remove carefully with offset tweezers.',
      'Sea Bass: Sear sea bass skin-side down in olive oil for 4 minutes, flip and baste with melted butter for 2 minutes.',
      'To Plate: Arrange sea bass, top with the lacy squid ink tuile, and garnish with salty sea beans.'
    ],
    tools: ['Mercer Culinary Offset Plating Tweezers'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'risotto-milanese',
    title: 'Saffron-Infused Risotto Milanese with Bone Marrow',
    chef: 'Chef Antoine Laurent',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&auto=format&fit=crop&q=80',
    description: 'Creamy Carnaroli rice slowly cooked with saffron threads, white wine, and rich beef stock, topped with roasted bone marrow.',
    prepTime: '45 mins',
    difficulty: 'Medium',
    calories: 610,
    videoUrl: 'https://www.youtube.com/watch?v=0kFj23yOqHk',
    ingredients: [
      '1 cup Carnaroli Rice',
      '1 pinch Saffron Threads',
      '2 Beef Bone Marrow sections',
      '1/2 cup Dry White Wine',
      '4 cups Simmering Beef Stock',
      '1/2 cup Aged Parmigiano-Reggiano',
      '2 tbsp Butter'
    ],
    steps: [
      'Roast bone marrow at 420°F for 15 minutes until fat renders and tops are browned.',
      'Risotto: Toast rice in butter, add white wine to deglaze. Slowly add stock one ladle at a time, stirring constantly.',
      'Stir in saffron liquid midway. When rice is al dente, vigorously stir in butter and grated cheese (mantecatura).',
      'Plate creamy risotto, place hot roasted bone marrow section in the center, and garnish.'
    ],
    tools: ['Bernardaud Porcelain Saffron Coupe Plate'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'chocolate-souffle',
    title: 'Dark Chocolate Soufflé with Salted Caramel Core',
    chef: 'Chef Melissa Thorne',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200&auto=format&fit=crop&q=80',
    description: 'An airy, molten dark chocolate soufflé hiding a hot, liquid salted butter caramel center.',
    prepTime: '40 mins',
    difficulty: 'Expert',
    calories: 550,
    videoUrl: 'https://www.youtube.com/watch?v=F3xO2L7hCg0',
    ingredients: [
      '4 oz Valrhona 70% Dark Chocolate',
      '3 Egg Whites',
      '2 Egg Yolks',
      '3 tbsp Sugar',
      'Salted Caramel sauce (frozen into tiny cubes)'
    ],
    steps: [
      'Butter ramekins and coat inside with sugar. Melt chocolate and yolks over a double boiler.',
      'Whip egg whites and sugar to soft peaks. Gently fold into the melted chocolate in three additions.',
      'Fill ramekins halfway, insert a frozen salted caramel cube in the center, then fill to the top. Scrape rims clean.',
      'Bake at 390°F (200°C) for exactly 11 minutes. Serve immediately before the rise collapses.'
    ],
    tools: ['KitchenAid Commercial 8-Quart Mixer'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'roasted-octopus',
    title: 'Charred Spanish Octopus with Romesco Sauce',
    chef: 'Chef Jean-Luc',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=1200&auto=format&fit=crop&q=80',
    description: 'Tender octopus tentacle braised and charred to crispy perfection, paired with smoky red pepper Romesco sauce.',
    prepTime: '55 mins',
    difficulty: 'Medium',
    calories: 420,
    videoUrl: 'https://www.youtube.com/watch?v=XzWzKz60o_Y',
    ingredients: [
      '1 large Spanish Octopus Tentacle',
      'Romesco: 2 Roasted Red Peppers, 1/4 cup Toasted Almonds, 1 clove Garlic, 2 tbsp Olive Oil, 1 tbsp Sherry Vinegar',
      'Fingerling Potatoes',
      'Smoked Paprika'
    ],
    steps: [
      'Braise octopus tentacle in a covered pot with garlic and white wine at 320°F for 40 minutes until tender.',
      'Romesco: Blend red peppers, almonds, garlic, olive oil, and vinegar until a thick textured paste forms.',
      'Sear braised tentacle in a piping hot cast-iron skillet with oil until charred and crispy on the edges.',
      'Plate the warm romesco sauce, place tentacle on top, and surround with roasted fingerling potatoes.'
    ],
    tools: ['Smithey Cast Iron Skillet (12-inch)'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'foie-gras-torchon',
    title: 'Foie Gras Torchon with Spiced Fig Jam',
    chef: 'Chef Jean-Luc',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=1200&auto=format&fit=crop&q=80',
    description: 'Silky, cured duck foie gras prepared in a traditional torchon towel, served with an aromatic spiced fig compote.',
    prepTime: '2 hours',
    difficulty: 'Expert',
    calories: 680,
    videoUrl: 'https://www.youtube.com/watch?v=Csk2TeeVqC0',
    ingredients: [
      '1 lb Raw Grade A Duck Foie Gras',
      '1 tsp Pink Curing Salt',
      '2 tbsp Sauternes Wine',
      '6 Fresh Figs (chopped)',
      '1/4 cup Brown Sugar',
      'Cinnamon and Star Anise'
    ],
    steps: [
      'De-vein foie gras lobe. Season with curing salt and Sauternes, roll tightly in a cheesecloth cylinder.',
      'Poach torchon in hot water at 155°F (68°C) for 90 seconds, then plunge into ice bath and chill for 24 hours.',
      'Fig Jam: Cook fresh figs with brown sugar, cinnamon, and star anise until thick and glossy.',
      'Slice chilled foie gras torchon with a warm knife and serve with fig jam and toasted brioche.'
    ],
    tools: ['Anova Precision Cooker Pro', 'Yaxell Super Gou Damascus Chef Knife (8-inch)'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'heirloom-carrots',
    title: 'Glazed Heirloom Carrots with Cumin Cream',
    chef: 'Chef Melissa Thorne',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80',
    description: 'Multi-colored baby heirloom carrots roasted with maple glaze, served over a light toasted cumin yoghurt cream.',
    prepTime: '25 mins',
    difficulty: 'Easy',
    calories: 210,
    videoUrl: 'https://www.youtube.com/watch?v=F3xO2L7hCg0',
    ingredients: [
      '1 bunch Baby Heirloom Carrots',
      '2 tbsp Maple Syrup',
      '1 tbsp Butter',
      '1/2 cup Greek Yoghurt',
      '1/2 tsp Toasted Cumin Seeds',
      'Fresh dill for garnish'
    ],
    steps: [
      'Toss carrots with maple syrup and butter. Roast at 400°F for 20 minutes until tender and caramelized.',
      'Toast cumin seeds and fold into Greek yoghurt with a pinch of sea salt.',
      'Spoon cumin cream on a plate, lay baby carrots side by side, and garnish with fresh dill.'
    ],
    tools: ['Mercer Culinary Offset Plating Tweezers'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'matcha-panna-cotta',
    title: 'Matcha Green Tea Panna Cotta with Black Sesame',
    chef: 'Chef Melissa Thorne',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200&auto=format&fit=crop&q=80',
    description: 'A silky, velvet panna cotta infused with organic Japanese Uji matcha, decorated with toasted black sesame soil.',
    prepTime: '30 mins',
    difficulty: 'Medium',
    calories: 340,
    videoUrl: 'https://www.youtube.com/watch?v=F3xO2L7hCg0',
    ingredients: [
      '1 cup Heavy Cream',
      '1/2 cup Whole Milk',
      '1 tbsp Premium Matcha Powder',
      '2 Gelatin sheets',
      '3 tbsp Sugar',
      'Black sesame seeds (crushed for soil)'
    ],
    steps: [
      'Soften gelatin sheets in cold water. Heat cream, milk, and sugar in a pot until warm.',
      'Whisk in matcha powder until completely dissolved. Remove from heat and stir in softened gelatin.',
      'Strain mixture through a fine sieve, pour into molds, and refrigerate for 4 hours to set.',
      'Unmold panna cotta, top with crunchy black sesame soil, and serve.'
    ],
    tools: ['KitchenAid Commercial 8-Quart Mixer'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'porcini-veloute',
    title: 'Wild Porcini Velouté with Truffle Foam',
    chef: 'Chef Antoine Laurent',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&auto=format&fit=crop&q=80',
    description: 'A rich, forest mushroom velouté made from wild porcini and chanterelles, topped with light, molecular white truffle foam.',
    prepTime: '35 mins',
    difficulty: 'Expert',
    calories: 280,
    videoUrl: 'https://www.youtube.com/watch?v=0kFj23yOqHk',
    ingredients: [
      '1/2 lb Fresh Porcini Mushrooms',
      '1/2 lb Chanterelle Mushrooms',
      '1 small Shallot (chopped)',
      '2 cups Chicken Stock',
      '1/2 cup Cream',
      'Foam: 1/2 cup Whole Milk, 1 tsp Truffle Oil, 1g Soy Lecithin'
    ],
    steps: [
      'Sauté mushrooms and shallots in butter until soft. Add stock and simmer for 15 minutes. Blend until silky and stir in cream.',
      'Truffle Foam: Combine milk, white truffle oil, and soy lecithin. Insert hand blender half-submerged to aerate into a light foam.',
      'Pour warm mushroom soup into a heated bowl. Spoon airy truffle foam over the top and serve.'
    ],
    tools: ['Bernardaud Porcelain Saffron Coupe Plate'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'smoked-duck-salad',
    title: 'Smoked Duck Salad with Orange Citrus reduction',
    chef: 'Chef Jean-Luc',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=1200&auto=format&fit=crop&q=80',
    description: 'Thinly sliced oak-smoked duck breast set over baby frisée, fresh orange segments, and a sweet blood orange vinaigrette.',
    prepTime: '30 mins',
    difficulty: 'Medium',
    calories: 460,
    videoUrl: 'https://www.youtube.com/watch?v=2n5w4cK5R-U',
    ingredients: [
      '6 oz Smoked Duck Breast (thinly sliced)',
      '2 cups Frisée lettuce',
      '1 Blood Orange (segments)',
      '1/2 cup Orange Juice',
      '1 tbsp Honey',
      '1 tbsp Olive Oil'
    ],
    steps: [
      'Simmer orange juice and honey in a saucepan until it reduces into a syrupy citrus glaze. Let cool.',
      'Whisk citrus reduction with olive oil to form a smooth vinaigrette.',
      'Toss frisée and blood orange segments with the vinaigrette.',
      'Plate the salad mixture, arrange smoked duck slices overlapping, and drizzle with remaining glaze.'
    ],
    tools: ['Yaxell Super Gou Damascus Chef Knife (8-inch)'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'pork-belly-compote',
    title: 'Sous-Vide Pork Belly with Apple Ginger Compote',
    chef: 'Chef Antoine Laurent',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=1200&auto=format&fit=crop&q=80',
    description: 'Pork belly cooked for 24 hours under vacuum, crisped in a skillet, served with fresh apple ginger sauce.',
    prepTime: '24 hours',
    difficulty: 'Medium',
    calories: 840,
    videoUrl: 'https://www.youtube.com/watch?v=0kFj23yOqHk',
    ingredients: [
      '1 lb Pork Belly slab',
      '1 Red Apple (finely diced)',
      '1 tsp Grated Fresh Ginger',
      '2 tbsp Apple Cider Vinegar',
      '1 tbsp Sugar',
      'Aromatic spices'
    ],
    steps: [
      'Vacuum seal pork belly with salt and five-spice. Cook at 155°F (68°C) for 24 hours.',
      'Unwrap, pat dry, and slice into thick squares. Sear skin-side down in a dry hot pan until crispy.',
      'Compote: Cook apple cubes, ginger, vinegar, and sugar in a small saucepan until soft and jammy.',
      'Serve seared crispy pork belly topped with warm apple ginger compote.'
    ],
    tools: ['Anova Precision Cooker Pro', 'Smithey Cast Iron Skillet (12-inch)'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'king-prawns-garlic',
    title: 'Butter-Poached King Prawns with Sea Beans',
    chef: 'Chef Jean-Luc',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&auto=format&fit=crop&q=80',
    description: 'Jumbo prawns gently poached in garlic herb butter, presented on a bed of sautéed sea beans and micro greens.',
    prepTime: '20 mins',
    difficulty: 'Easy',
    calories: 390,
    videoUrl: 'https://www.youtube.com/watch?v=AmC9HykerUk',
    ingredients: [
      '6 Jumbo Tiger Prawns (peeled and deveined)',
      '4 oz Garlic Butter',
      '1 bunch Salicornia (sea beans)',
      '1 Lemon',
      'Micro-coriander'
    ],
    steps: [
      'Gently heat garlic butter to a bare simmer. Add prawns and cook for 6 minutes until pink and curled.',
      'Sauté sea beans in a drop of butter for 2 minutes to retain crunch.',
      'Arrange sea beans in the center of the plate, place poached prawns on top, and pour warm garlic butter over them.'
    ],
    tools: ['Mercer Culinary Offset Plating Tweezers'],
    reviews: [],
    cookedVersions: []
  },
  {
    id: 'coconut-consomme',
    title: 'Coconut Lime Lemongrass Consommé with Crab',
    chef: 'Chef Antoine Laurent',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&auto=format&fit=crop&q=80',
    description: 'A crystal-clear lemongrass and coconut water broth poured tableside over fresh King Crab meat.',
    prepTime: '40 mins',
    difficulty: 'Expert',
    calories: 220,
    videoUrl: 'https://www.youtube.com/watch?v=0kFj23yOqHk',
    ingredients: [
      '2 cups Coconut Water',
      '2 stalks Lemongrass (bruised)',
      '1 Lime (juiced)',
      '4 oz King Crab meat',
      'Egg whites (for broth clarification)',
      'Kaffir lime leaves'
    ],
    steps: [
      'Consommé: Simmer coconut water with lemongrass and kaffir lime leaves. Clarify using egg whites to form a raft, then strain.',
      'Arrange clean sweet King Crab meat chunks in the center of a shallow porcelain coupe plate.',
      'Garnish with microgreens. Pour the crystal-clear hot consommé around the crab tableside and serve.'
    ],
    tools: ['Bernardaud Porcelain Saffron Coupe Plate', 'Mercer Culinary Offset Plating Tweezers'],
    reviews: [],
    cookedVersions: []
  }
];
