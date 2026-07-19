import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Edit3, Award, Heart, Camera, Check, X, Star, Users, Trash2, CheckCircle, Video, ChefHat } from 'lucide-react';

const Profile: React.FC = () => {
  const { 
    currentUser, 
    recipes, 
    classes,
    updateProfile, 
    setCurrentView, 
    setActiveRecipeId,
    addRecipe,
    addClass,
    usersList,
    chefsList,
    pendingChefsList,
    approveChef,
    deactivateChef,
    deleteUser,
    deleteRecipe,
    deleteClass
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  // Edit states
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [level, setLevel] = useState(currentUser?.level || 'Home Chef');

  // Chef Studio tab (for chefs)
  const [chefStudioTab, setChefStudioTab] = useState<'recipe' | 'class'>('recipe');

  // Admin control tab (for admin)
  const [adminTab, setAdminTab] = useState<'approvals' | 'users' | 'recipes' | 'publish'>('approvals');

  // Class form state
  const [classTitle, setClassTitle] = useState('');
  const [classDesc, setClassDesc] = useState('');
  const [classImage, setClassImage] = useState('');
  const [classDuration, setClassDuration] = useState('45 mins');
  const [classLevel, setClassLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Beginner');
  const [classVideo, setClassVideo] = useState('');
  const [classSuccess, setClassSuccess] = useState(false);

  // Admin recipe form state
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDesc, setRecipeDesc] = useState('');
  const [recipeImage, setRecipeImage] = useState('');
  const [recipePrep, setRecipePrep] = useState('30 mins');
  const [recipeDiff, setRecipeDiff] = useState<'Easy' | 'Medium' | 'Expert'>('Medium');
  const [recipeCals, setRecipeCals] = useState('450');
  const [recipeVideo, setRecipeVideo] = useState('https://www.youtube.com/watch?v=F3xO2L7hCg0');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipeSteps, setRecipeSteps] = useState('');
  const [recipeTools, setRecipeTools] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, bio, level });
    setIsEditing(false);
  };

  const handleCreateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArr = recipeIngredients.split('\n').map(i => i.trim()).filter(Boolean);
    const stepsArr = recipeSteps.split('\n').map(s => s.trim()).filter(Boolean);
    const toolsArr = recipeTools.split(',').map(t => t.trim()).filter(Boolean);

    addRecipe({
      title: recipeTitle,
      description: recipeDesc,
      image: recipeImage || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600',
      prepTime: recipePrep,
      difficulty: recipeDiff,
      calories: Number(recipeCals) || 450,
      videoUrl: recipeVideo,
      ingredients: ingredientsArr,
      steps: stepsArr,
      tools: toolsArr
    });

    setRecipeTitle('');
    setRecipeDesc('');
    setRecipeImage('');
    setRecipePrep('30 mins');
    setRecipeDiff('Medium');
    setRecipeCals('450');
    setRecipeIngredients('');
    setRecipeSteps('');
    setRecipeTools('');
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    addClass({
      title: classTitle,
      description: classDesc,
      image: classImage || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      duration: classDuration,
      level: classLevel,
      videoUrl: classVideo || 'https://www.youtube.com/watch?v=YoxXQ4n3Zws',
    });
    setClassTitle('');
    setClassDesc('');
    setClassImage('');
    setClassDuration('45 mins');
    setClassLevel('Beginner');
    setClassVideo('');
    setClassSuccess(true);
    setTimeout(() => setClassSuccess(false), 4000);
  };

  const handleRecipeClick = (recipeId: string) => {
    setActiveRecipeId(recipeId);
    setCurrentView('recipes');
  };

  // Normal User Recipe logic
  const savedRecipeObjects = recipes.filter(r => currentUser.savedRecipes.includes(r.id));

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left Side: Profile Details */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main Card */}
          <div className="glass-panel" style={{ padding: '28px', textAlign: 'center', position: 'relative' }}>
            {!isEditing && currentUser.role !== 'admin' && (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px', borderRadius: '50%', width: '32px', height: '32px' }}
                title="Edit Profile"
              >
                <Edit3 size={14} />
              </button>
            )}

            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px auto' }}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow-glow)'
                }}
              />
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} style={{ textAlign: 'left', marginTop: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Chef Level</label>
                  <select 
                    className="form-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    style={{ background: '#07090e', color: '#ffffff', borderColor: 'rgba(197,168,128,0.25)', colorScheme: 'dark' }}
                  >
                    <option value="Novice Cook" style={{ background: '#07090e', color: '#ffffff' }}>Novice Cook</option>
                    <option value="Home Chef" style={{ background: '#07090e', color: '#ffffff' }}>Home Chef</option>
                    <option value="Master Chef" style={{ background: '#07090e', color: '#ffffff' }}>Master Chef</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Culinary Bio</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3} 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setName(currentUser.name);
                      setBio(currentUser.bio);
                      setLevel(currentUser.level);
                      setIsEditing(false);
                    }}
                    style={{ padding: '8px 12px', fontSize: '0.75rem' }}
                  >
                    <X size={12} />
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.75rem' }}>
                    <Check size={12} />
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '6px', fontFamily: 'Playfair Display, serif' }}>{currentUser.name}</h2>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                  <span className="tag">{currentUser.level}</span>
                  <span className="tag" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {currentUser.role}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '12px' }}>
                  {currentUser.bio}
                </p>
              </>
            )}
          </div>

          {/* Badges Panel (Skip for Admin) */}
          {currentUser.role !== 'admin' && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="var(--primary)" /> Earned Badges
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentUser.badges.length > 0 ? (
                  currentUser.badges.map(badge => (
                    <div 
                      key={badge} 
                      className="tag" 
                      style={{
                        justifyContent: 'flex-start',
                        padding: '10px 14px',
                        background: 'var(--primary-glow)',
                        borderColor: 'rgba(197, 168, 128, 0.3)',
                        color: 'var(--primary)'
                      }}
                    >
                      <Award size={14} />
                      <span>{badge}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No badges earned yet. Upload cooked dishes to unlock rewards!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Admin Command Center OR Normal User Content */}
        <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {currentUser.role === 'admin' ? (
            /* ADMIN COMMAND CENTER (PURA CONTROL) */
            <div className="glass-panel animate-fade-in" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
                <Users size={24} color="var(--primary)" />
                <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'Playfair Display, serif' }}>Admin System Control</h2>
              </div>

              {/* Console Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAdminTab('approvals')}
                  className="btn"
                  style={{
                    background: adminTab === 'approvals' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.02)',
                    color: adminTab === 'approvals' ? '#07090e' : 'var(--text-primary)',
                    border: '1px solid var(--border-glass)',
                    padding: '8px 16px',
                    fontSize: '0.8rem'
                  }}
                >
                  Chef Approvals ({pendingChefsList.length})
                </button>
                <button
                  onClick={() => setAdminTab('users')}
                  className="btn"
                  style={{
                    background: adminTab === 'users' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.02)',
                    color: adminTab === 'users' ? '#07090e' : 'var(--text-primary)',
                    border: '1px solid var(--border-glass)',
                    padding: '8px 16px',
                    fontSize: '0.8rem'
                  }}
                >
                  Manage Users ({usersList.length})
                </button>
                <button
                  onClick={() => setAdminTab('recipes')}
                  className="btn"
                  style={{
                    background: adminTab === 'recipes' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.02)',
                    color: adminTab === 'recipes' ? '#07090e' : 'var(--text-primary)',
                    border: '1px solid var(--border-glass)',
                    padding: '8px 16px',
                    fontSize: '0.8rem'
                  }}
                >
                  Manage Content ({recipes.length + classes.length})
                </button>
                <button
                  onClick={() => setAdminTab('publish')}
                  className="btn"
                  style={{
                    background: adminTab === 'publish' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.02)',
                    color: adminTab === 'publish' ? '#07090e' : 'var(--text-primary)',
                    border: '1px solid var(--border-glass)',
                    padding: '8px 16px',
                    fontSize: '0.8rem'
                  }}
                >
                  Publish Recipe
                </button>
              </div>

              {/* Tab Content: Chef Approvals */}
              {adminTab === 'approvals' && (
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary)' }}>Pending Chef Credentials Applications</h3>
                  {pendingChefsList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      No pending applications at this time. All chefs are verified!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {pendingChefsList.map(chef => (
                        <div key={chef.id} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '16px' }}>
                          <img src={chef.avatar} alt={chef.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                          <div style={{ flexGrow: 1 }}>
                            <h4 style={{ fontSize: '1.1rem', margin: '0 0 4px 0' }}>{chef.name}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 6px 0', fontStyle: 'italic' }}>"{chef.bio}"</p>
                            <span className="tag" style={{ fontSize: '0.65rem' }}>Pending Credentials Review</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => approveChef(chef.id)}
                              className="btn btn-primary"
                              style={{ padding: '8px 14px', fontSize: '0.75rem', borderRadius: '8px' }}
                            >
                              <CheckCircle size={14} /> Approve Chef
                            </button>
                            <button
                              onClick={() => deactivateChef(chef.id)}
                              className="btn btn-secondary"
                              style={{ padding: '8px 14px', fontSize: '0.75rem', borderRadius: '8px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.2rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>Currently Active Platform Chefs</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {chefsList.map(chef => (
                      <div key={chef.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                        <img src={chef.avatar} alt={chef.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{chef.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{chef.bio.split('|')[0]}</span>
                        </div>
                        <button
                          onClick={() => deactivateChef(chef.id)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '6px', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                        >
                          Revoke Status
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: User Directory */}
              {adminTab === 'users' && (
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary)' }}>Registered Users & Food Lovers</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {usersList.map(user => (
                      <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                        <img src={user.avatar} alt={user.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: '1rem', margin: 0 }}>{user.name}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{user.bio}</p>
                        </div>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '6px', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                        >
                          <Trash2 size={12} /> Remove User
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: Content Moderation */}
              {adminTab === 'recipes' && (
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary)' }}>Recipe Submissions QC ({recipes.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {recipes.map(recipe => (
                      <div key={recipe.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                        <img src={recipe.image} alt={recipe.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{recipe.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>By {recipe.chef}</span>
                        </div>
                        <button
                          onClick={() => deleteRecipe(recipe.id)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '6px', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                        >
                          <Trash2 size={12} /> Purge Recipe
                        </button>
                      </div>
                    ))}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary)' }}>Culinary Academy Masterclasses ({classes.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {classes.map(cls => (
                      <div key={cls.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                        <img src={cls.image} alt={cls.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{cls.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Instructor: {cls.instructor}</span>
                        </div>
                        <button
                          onClick={() => deleteClass(cls.id)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '6px', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                        >
                          <Trash2 size={12} /> Remove Class
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: Publish Recipe */}
              {adminTab === 'publish' && (
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--primary)' }}>Admin laboratory: Publish Gourmet Recipe</h3>
                  {publishSuccess && (
                    <div className="tag" style={{ background: 'rgba(74, 222, 128, 0.08)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)', width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem', justifyContent: 'flex-start' }}>
                      ✓ Gourmet recipe successfully published to Kitchen Hub database!
                    </div>
                  )}

                  <form onSubmit={handleCreateRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Dish Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Lobster Thermidor"
                          className="form-input"
                          value={recipeTitle}
                          onChange={(e) => setRecipeTitle(e.target.value)}
                          required
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Image URL</label>
                        <input 
                          type="url" 
                          placeholder="Unsplash photography link"
                          className="form-input"
                          value={recipeImage}
                          onChange={(e) => setRecipeImage(e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Description</label>
                      <textarea 
                        rows={2}
                        placeholder="Provide a sensory overview..."
                        className="form-textarea"
                        value={recipeDesc}
                        onChange={(e) => setRecipeDesc(e.target.value)}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Prep Duration</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 45 mins"
                          className="form-input"
                          value={recipePrep}
                          onChange={(e) => setRecipePrep(e.target.value)}
                          required
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Difficulty</label>
                        <select 
                          className="form-select"
                          value={recipeDiff}
                          onChange={(e: any) => setRecipeDiff(e.target.value)}
                          style={{ 
                            width: '100%', 
                            background: '#07090e', 
                            color: '#ffffff', 
                            borderColor: 'rgba(197,168,128,0.25)',
                            colorScheme: 'dark'
                          }}
                        >
                          <option value="Easy" style={{ background: '#07090e', color: '#ffffff' }}>Easy</option>
                          <option value="Medium" style={{ background: '#07090e', color: '#ffffff' }}>Medium</option>
                          <option value="Expert" style={{ background: '#07090e', color: '#ffffff' }}>Expert</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Calories</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 520"
                          className="form-input"
                          value={recipeCals}
                          onChange={(e) => setRecipeCals(e.target.value)}
                          required
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Video (YT Link)</label>
                        <input 
                          type="url" 
                          placeholder="YouTube Video URL"
                          className="form-input"
                          value={recipeVideo}
                          onChange={(e) => setRecipeVideo(e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Ingredients (One per line)</label>
                      <textarea 
                        rows={3}
                        placeholder="16oz Beef Fillet&#10;2 tbsp Truffle Butter"
                        className="form-textarea"
                        value={recipeIngredients}
                        onChange={(e) => setRecipeIngredients(e.target.value)}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Cooking Instructions (One step per line)</label>
                      <textarea 
                        rows={3}
                        placeholder="Score the skin.&#10;Sear in a smoking skillet for 2 mins."
                        className="form-textarea"
                        value={recipeSteps}
                        onChange={(e) => setRecipeSteps(e.target.value)}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Kitchen Tools (Comma-separated)</label>
                      <input 
                        type="text" 
                        placeholder="Smithey Cast Iron Skillet, Offset Tweezers"
                        className="form-input"
                        value={recipeTools}
                        onChange={(e) => setRecipeTools(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '12px 24px', borderRadius: '10px' }}>
                      Publish Recipe
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            /* NORMAL USER OR CHEF DETAILS */
            <>
              {/* Saved Recipes */}
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="var(--primary)" /> Saved Culinary Creations
                </h3>
                
                {savedRecipeObjects.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {savedRecipeObjects.map(recipe => (
                      <div 
                        key={recipe.id}
                        onClick={() => handleRecipeClick(recipe.id)}
                        className="glass-panel glass-panel-hover"
                        style={{
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          cursor: 'pointer',
                          borderRadius: '16px'
                        }}
                      >
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-glass)' }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{recipe.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>By {recipe.chef}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    You haven't saved any culinary creations yet. Head to Recipes to save your favorites!
                  </div>
                )}
              </div>

              {/* Cooked Dishes Log */}
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={18} color="var(--primary)" /> My Cooking Results
                </h3>
                
                {currentUser.cookedVersions.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '24px'
                  }}>
                    {currentUser.cookedVersions.map((cooked, idx) => (
                      <div 
                        key={idx}
                        className="glass-panel"
                        style={{
                          borderRadius: '16px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <div style={{ height: '140px' }}>
                          <img 
                            src={cooked.image} 
                            alt={cooked.recipeTitle} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <h4 
                            onClick={() => handleRecipeClick(cooked.recipeId)}
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                          >
                            {cooked.recipeTitle}
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                            "{cooked.comment}"
                          </p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cooked.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    You haven't shared any cooking outcomes yet. Pick a recipe, cook it, and post your photo!
                  </div>
                )}
              </div>

              {/* Chef Studio Panel (For logged-in Chefs only) */}
              {currentUser.role === 'chef' && (
                <div className="glass-panel" style={{ padding: '28px' }}>
                  {/* Studio Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
                    <ChefHat size={22} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'Playfair Display, serif' }}>Chef Studio</h3>
                  </div>

                  {/* Studio Tabs */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <button
                      onClick={() => setChefStudioTab('recipe')}
                      className="btn"
                      style={{
                        background: chefStudioTab === 'recipe' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.03)',
                        color: chefStudioTab === 'recipe' ? '#07090e' : '#ffffff',
                        border: '1px solid var(--border-glass)',
                        padding: '10px 20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Star size={15} color={chefStudioTab === 'recipe' ? '#07090e' : 'var(--primary)'} />
                      Share Recipe
                    </button>
                    <button
                      onClick={() => setChefStudioTab('class')}
                      className="btn"
                      style={{
                        background: chefStudioTab === 'class' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.03)',
                        color: chefStudioTab === 'class' ? '#07090e' : '#ffffff',
                        border: '1px solid var(--border-glass)',
                        padding: '10px 20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Video size={15} color={chefStudioTab === 'class' ? '#07090e' : 'var(--primary)'} />
                      Teach Online
                    </button>
                  </div>
                  
                  {/* TAB: Share Recipe */}
                  {chefStudioTab === 'recipe' && (
                    <div>
                      {publishSuccess && (
                        <div className="tag" style={{ background: 'rgba(74, 222, 128, 0.08)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)', width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem', justifyContent: 'flex-start' }}>
                          ✓ Recipe published to Kitchen Hub!
                        </div>
                      )}
                      <form onSubmit={handleCreateRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Dish Title</label>
                            <input type="text" placeholder="e.g. Lobster Thermidor" className="form-input" value={recipeTitle} onChange={(e) => setRecipeTitle(e.target.value)} required style={{ width: '100%' }} />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Photo URL</label>
                            <input type="url" placeholder="Unsplash link" className="form-input" value={recipeImage} onChange={(e) => setRecipeImage(e.target.value)} style={{ width: '100%' }} />
                          </div>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Description</label>
                          <textarea rows={2} placeholder="Describe your dish..." className="form-textarea" value={recipeDesc} onChange={(e) => setRecipeDesc(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Prep Time</label>
                            <input type="text" placeholder="30 mins" className="form-input" value={recipePrep} onChange={(e) => setRecipePrep(e.target.value)} required style={{ width: '100%' }} />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Difficulty</label>
                            <select className="form-select" value={recipeDiff} onChange={(e: any) => setRecipeDiff(e.target.value)} style={{ width: '100%', background: '#07090e', color: '#ffffff', borderColor: 'rgba(197,168,128,0.25)', colorScheme: 'dark' }}>
                              <option value="Easy" style={{ background: '#07090e', color: '#ffffff' }}>Easy</option>
                              <option value="Medium" style={{ background: '#07090e', color: '#ffffff' }}>Medium</option>
                              <option value="Expert" style={{ background: '#07090e', color: '#ffffff' }}>Expert</option>
                            </select>
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Calories</label>
                            <input type="number" placeholder="520" className="form-input" value={recipeCals} onChange={(e) => setRecipeCals(e.target.value)} required style={{ width: '100%' }} />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">YouTube Link</label>
                            <input type="url" placeholder="YouTube Video URL" className="form-input" value={recipeVideo} onChange={(e) => setRecipeVideo(e.target.value)} style={{ width: '100%' }} />
                          </div>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Ingredients (one per line)</label>
                          <textarea rows={3} placeholder="16oz Beef Fillet&#10;2 tbsp Truffle Butter" className="form-textarea" value={recipeIngredients} onChange={(e) => setRecipeIngredients(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Cooking Steps (one per line)</label>
                          <textarea rows={3} placeholder="Score the skin.&#10;Sear 2 mins each side." className="form-textarea" value={recipeSteps} onChange={(e) => setRecipeSteps(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Kitchen Tools (comma-separated)</label>
                          <input type="text" placeholder="Smithey Cast Iron, Offset Tweezers" className="form-input" value={recipeTools} onChange={(e) => setRecipeTools(e.target.value)} style={{ width: '100%' }} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '12px 28px', borderRadius: '10px' }}>
                          <Star size={15} /> Publish Recipe
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB: Teach Online */}
                  {chefStudioTab === 'class' && (
                    <div>
                      {classSuccess && (
                        <div className="tag" style={{ background: 'rgba(74, 222, 128, 0.08)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)', width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem', justifyContent: 'flex-start' }}>
                          ✓ Masterclass published to the Learning Academy!
                        </div>
                      )}
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px', lineHeight: 1.6 }}>
                        Share your culinary expertise with the Kitchen Hub community. Create a masterclass video session that students can enroll in and learn from.
                      </p>
                      <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Class Title</label>
                            <input type="text" placeholder="e.g. Mastering Knife Skills" className="form-input" value={classTitle} onChange={(e) => setClassTitle(e.target.value)} required style={{ width: '100%' }} />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Thumbnail URL</label>
                            <input type="url" placeholder="Unsplash photo link" className="form-input" value={classImage} onChange={(e) => setClassImage(e.target.value)} style={{ width: '100%' }} />
                          </div>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Class Description</label>
                          <textarea rows={2} placeholder="What will students learn in your class?" className="form-textarea" value={classDesc} onChange={(e) => setClassDesc(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Duration</label>
                            <input type="text" placeholder="e.g. 1h 20m" className="form-input" value={classDuration} onChange={(e) => setClassDuration(e.target.value)} required style={{ width: '100%' }} />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Difficulty Level</label>
                            <select className="form-select" value={classLevel} onChange={(e: any) => setClassLevel(e.target.value)} style={{ width: '100%', background: '#07090e', color: '#ffffff', borderColor: 'rgba(197,168,128,0.25)', colorScheme: 'dark' }}>
                              <option value="Beginner" style={{ background: '#07090e', color: '#ffffff' }}>Beginner</option>
                              <option value="Intermediate" style={{ background: '#07090e', color: '#ffffff' }}>Intermediate</option>
                              <option value="Expert" style={{ background: '#07090e', color: '#ffffff' }}>Expert</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">YouTube Class Video Link</label>
                          <input type="url" placeholder="https://www.youtube.com/watch?v=..." className="form-input" value={classVideo} onChange={(e) => setClassVideo(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '12px 28px', borderRadius: '10px' }}>
                          <Video size={15} /> Publish Masterclass
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default Profile;
