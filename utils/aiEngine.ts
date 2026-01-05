import { beginnerModules, advancedTopics, aiKnowledgeBase } from '@/data/content';

/**
 * AI Engine for Stryde SG
 * Uses module content and knowledge base to provide intelligent responses
 */

export interface AIContext {
  mode: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  userProfile?: any;
}

export class AIEngine {
  private moduleContent: string;
  private advancedContent: string;
  private keywords: Map<string, string[]>;

  constructor() {
    // Index all module content for quick search
    this.moduleContent = this.indexModuleContent();
    this.advancedContent = this.indexAdvancedContent();
    this.keywords = this.buildKeywordIndex();
  }

  private indexModuleContent(): string {
    let content = '';
    beginnerModules.forEach(module => {
      content += `\n\n### ${module.title}\n`;
      module.content.forEach(item => {
        if (item.type === 'text' || item.type === 'bullet') {
          content += item.content + ' ';
        }
      });
    });
    return content;
  }

  private indexAdvancedContent(): string {
    let content = '';
    advancedTopics.forEach(topic => {
      content += `\n\n### ${topic.title}\n`;
      content += topic.content.explanation + ' ';
      topic.content.keyFindings.forEach(finding => {
        content += finding + ' ';
      });
    });
    return content;
  }

  private buildKeywordIndex(): Map<string, string[]> {
    const index = new Map<string, string[]>();
    
    // Nutrition keywords
    index.set('protein', ['protein', 'amino acids', 'muscle', 'growth', 'meat', 'fish', 'tofu', 'eggs']);
    index.set('carbs', ['carbohydrate', 'carbs', 'rice', 'bread', 'noodles', 'pasta', 'energy', 'glucose']);
    index.set('fats', ['fat', 'fats', 'lipids', 'oils', 'avocado', 'nuts', 'omega']);
    index.set('fiber', ['fiber', 'fibre', 'vegetables', 'fruits', 'wholegrain', 'digestion']);
    index.set('vitamins', ['vitamin', 'minerals', 'micronutrients', 'calcium', 'iron', 'vitamin d']);
    index.set('water', ['water', 'hydration', 'dehydration', 'drink', 'fluids']);
    index.set('sugar', ['sugar', 'added sugar', 'sweet', 'dessert', 'candy', 'glucose']);
    
    // Exercise keywords
    index.set('exercise', ['exercise', 'workout', 'training', 'fitness', 'physical activity']);
    index.set('strength', ['strength', 'resistance', 'weights', 'muscle building', 'lifting']);
    index.set('cardio', ['cardio', 'cardiovascular', 'running', 'aerobic', 'endurance']);
    index.set('neat', ['neat', 'non-exercise activity', 'daily movement', 'walking', 'stairs']);
    
    // Health keywords
    index.set('sleep', ['sleep', 'rest', 'insomnia', 'tired', 'fatigue', 'circadian']);
    index.set('stress', ['stress', 'anxiety', 'cortisol', 'pressure', 'overwhelmed']);
    index.set('weight', ['weight', 'bmi', 'body composition', 'weight loss', 'weight gain']);
    index.set('metabolism', ['metabolism', 'metabolic', 'bmr', 'tdee', 'energy expenditure']);
    index.set('puberty', ['puberty', 'adolescence', 'teen', 'growth', 'development', 'hormones']);
    
    // Singapore food keywords
    index.set('hawker', ['hawker', 'canteen', 'food court', 'local food']);
    index.set('bubble tea', ['bubble tea', 'bbt', 'milk tea', 'boba']);
    index.set('chicken rice', ['chicken rice', 'hainanese chicken']);
    index.set('nasi lemak', ['nasi lemak', 'coconut rice']);
    
    return index;
  }

  public generateResponse(query: string, context: AIContext): string {
    const lowerQuery = query.toLowerCase();
    
    // Safety guardrails (highest priority)
    if (this.checkSafety(lowerQuery)) {
      return this.getSafetyResponse(lowerQuery);
    }

    // Unified mode - intelligent routing based on query content
    return this.handleUnifiedMode(lowerQuery, context);
  }

  private handleUnifiedMode(query: string, context: AIContext): string {
    // Detect question type and route accordingly
    
    // 1. Safety and support needs (emotional/mental health)
    if (this.needsSupport(query)) {
      return this.handleSupport(query);
    }

    // 2. Myth-busting/fact-checking questions
    if (this.isMythCheck(query)) {
      return this.handleMythBuster(query);
    }

    // 3. Navigation/app usage questions
    if (this.isNavigationQuestion(query)) {
      return this.handleNavigator(query);
    }

    // 4. Goal-setting and coaching questions
    if (this.isCoachingQuestion(query)) {
      return this.handleCoach(query, context);
    }

    // 5. Try to find relevant content from modules first
    const moduleBasedResponse = this.findRelevantContent(query);
    if (moduleBasedResponse) {
      return moduleBasedResponse;
    }

    // 6. General health knowledge (not in modules but helpful)
    const generalResponse = this.handleGeneralHealth(query);
    if (generalResponse) {
      return generalResponse;
    }

    // 7. Fallback - guide user to resources
    return this.getFallbackResponse(query);
  }

  private needsSupport(query: string): boolean {
    const supportKeywords = [
      'stress', 'anxious', 'overwhelm', 'depressed', 'sad', 'lonely',
      'tired', 'exhausted', 'no energy', 'unmotivated', 'give up',
      'cant do', 'feeling down', 'worried', 'scared', 'afraid'
    ];
    return supportKeywords.some(word => query.includes(word));
  }

  private isMythCheck(query: string): boolean {
    const mythIndicators = [
      'is it true', 'myth', 'fact', 'heard that', 'someone said',
      'is this true', 'true or false', 'does', 'will', 'can',
      'make you fat', 'bad for', 'good for', 'should i avoid'
    ];
    return mythIndicators.some(indicator => query.includes(indicator));
  }

  private isNavigationQuestion(query: string): boolean {
    const navKeywords = [
      'how do i', 'where is', 'where can i', 'how to',
      'find', 'track', 'log', 'quiz', 'module', 'achievement',
      'navigate', 'use the app', 'settings'
    ];
    return navKeywords.some(word => query.includes(word));
  }

  private isCoachingQuestion(query: string): boolean {
    const coachKeywords = [
      'goal', 'start', 'begin', 'plan', 'routine', 'schedule',
      'improve', 'better', 'should i', 'help me', 'advice',
      'recommend', 'suggestion', 'what to do', 'how much'
    ];
    return coachKeywords.some(word => query.includes(word));
  }

  private handleGeneralHealth(query: string): string | null {
    // Handle health topics not explicitly in modules but helpful to answer

    // Hydration
    if (query.includes('hydrat') || query.includes('drink water') || query.includes('how much water')) {
      return '💧 **Hydration for Singapore Teens**\n\n**Daily water needs:**\n• General: 8-10 glasses (2-2.5L)\n• If active: 10-12+ glasses\n• Hot weather: Extra 2-4 glasses\n\n**Why it matters:**\n• Regulates body temperature (crucial in SG heat!)\n• Supports digestion\n• Maintains energy\n• Improves focus\n• Helps physical performance\n\n**Signs of dehydration:**\n• Dark yellow urine\n• Headache\n• Fatigue\n• Dry mouth\n\n**Singapore tip:**\nCarry a water bottle! Heat and humidity mean you need more than temperate climates.\n\n💡 **Track water intake in Track tab!**\n\n⚠️ Not medical advice';
    }

    // Portion sizes
    if (query.includes('portion') || query.includes('how much should i eat')) {
      return '🍽️ **Portion Guidance for Teens**\n\n**Hand method (easy!):**\n• Protein: Palm-sized portion\n• Carbs: Fist-sized portion\n• Fats: Thumb-sized portion\n• Veggies: Two handfuls\n\n**Teen reality:**\nYou\'re growing! Portions will be LARGER than adults. This is normal and healthy.\n\n**My Healthy Plate (Singapore):**\n• ½ plate: Fruits & vegetables\n• ¼ plate: Whole grains\n• ¼ plate: Protein\n\n**Listen to your body:**\n✓ Eat when hungry\n✓ Stop when comfortably full\n✓ Don\'t restrict during growth\n\n📚 **More details in:** "My Healthy Plate + Portioning Skills" module (Learn tab)\n\n⚠️ Not medical advice';
    }

    // Meal timing
    if (query.includes('when to eat') || query.includes('meal timing') || query.includes('eating at night')) {
      return '🕐 **Meal Timing & Teen Health**\n\n**Key principles:**\n1. **Total nutrition matters more than timing**\n2. **Regular meals prevent extreme hunger**\n3. **Listen to your body\'s signals**\n\n**General pattern:**\n• Breakfast: Within 1-2 hours of waking\n• Lunch: Midday\n• Dinner: 2-3 hours before bed\n• Snacks: As needed\n\n**Nighttime eating:**\n❌ Myth: "Eating at night makes you fat"\n✅ Truth: Total daily calories matter most, not timing\n\nHowever: Heavy meals right before bed can affect sleep quality.\n\n**Teen tip:**\nSchool schedules are rigid. Eat when you can, prioritize getting enough total nutrition.\n\n📚 **Deeper dive:** "Meal Timing & Circadian Rhythms" (Advanced topics)\n\n⚠️ Not medical advice';
    }

    // Supplements
    if (query.includes('supplement') || query.includes('vitamin pill') || query.includes('multivitamin')) {
      return '💊 **Supplements for Teens**\n\n**Do you need them?**\nMost teens can get nutrients from food. Supplements may help if:\n• Dietary restrictions (vegan, allergies)\n• Diagnosed deficiency (iron, vitamin D)\n• Recommended by doctor\n\n**Common teen deficiencies:**\n• **Iron** (especially girls with periods)\n• **Vitamin D** (limited sun exposure)\n• **Calcium** (if avoiding dairy)\n\n**Food-first approach:**\n✓ Iron: Red meat, beans, spinach, fortified cereals\n✓ Vitamin D: Fatty fish, fortified milk, sunshine\n✓ Calcium: Dairy, tofu, leafy greens\n\n**Singapore context:**\nSunshine is abundant - 15min daily sun exposure helps vitamin D!\n\n⚠️ **Important:**\n• Don\'t self-prescribe\n• Get blood tests if concerned\n• Some supplements can interfere with growth\n\n📚 **More in:** "Micronutrients + RDA Essentials" module\n\n⚠️ Not medical advice - consult healthcare provider';
    }

    // Breakfast
    if (query.includes('breakfast') && !query.includes('myth') && !query.includes('skip')) {
      return '🍳 **Breakfast for Teens**\n\n**Benefits:**\n• Fuel for morning classes\n• Improves focus and memory\n• Prevents extreme hunger at lunch\n• Helps meet daily nutrient needs\n\n**Not hungry in morning?**\nNormal! Try:\n• Smaller portion\n• Smoothie/drink\n• Eat mid-morning snack instead\n\n**Quick Singapore breakfast ideas:**\n✓ Wholegrain bread + peanut butter + banana\n✓ Oatmeal with fruits\n✓ Egg sandwich\n✓ Yogurt with granola\n✓ Kaya toast + soft-boiled eggs (local favorite!)\n\n**Avoid:**\n⚠️ Just sugary cereal (crashes by 10am)\n⚠️ Only coffee/tea (not a meal!)\n\n**Balance is key:**\nAim for protein + carbs + fruit\n\n💡 **Track your breakfast patterns in Track tab!**\n\n⚠️ Not medical advice';
    }

    // Snacking
    if (query.includes('snack') || query.includes('between meals')) {
      return '🍎 **Smart Snacking for Teens**\n\n**Are snacks okay?**\nYes! Growing teens often need 2-3 snacks daily.\n\n**Choose snacks with:**\n• Protein or fiber (keeps you full)\n• Real food (not just chips)\n• Reasonable portions\n\n**Good snack ideas:**\n🥜 Nuts and seeds\n🍌 Fruits (fresh or dried)\n🥚 Hard-boiled eggs\n🧀 Cheese and crackers\n🥤 Yogurt or milk\n🍞 Wholegrain toast with spreads\n\n**Singapore snacks:**\n✓ Peanut butter biscuits\n✓ Cut fruits (watermelon, papaya)\n✓ Roasted chickpeas\n✓ Trail mix\n\n**Watch out for:**\n⚠️ Constant grazing (makes it hard to notice hunger cues)\n⚠️ Eating from boredom vs hunger\n⚠️ Super processed snacks only\n\n**Smart rule:**\nSnack when hungry between meals, not as entertainment.\n\n⚠️ Not medical advice';
    }

    // Recovery after exercise
    if (query.includes('after workout') || query.includes('post workout') || query.includes('recovery')) {
      return '🏃‍♂️ **Recovery After Exercise**\n\n**Within 30-60 minutes after workout:**\n\n**What to eat:**\n• Carbs: Replenish energy stores\n• Protein: Repair muscles\n\nIdeal ratio: 3:1 or 4:1 carbs to protein\n\n**Easy post-workout options:**\n🥤 Chocolate milk (actually great!)\n🍌 Banana with peanut butter\n🍗 Chicken with rice\n🥪 Turkey sandwich\n🥣 Greek yogurt with granola\n\n**Singapore options:**\n✓ Chicken rice (perfect carb + protein)\n✓ Milo with wholegrain biscuits\n✓ Fruit juice + hard-boiled egg\n\n**Don\'t forget:**\n💧 Rehydrate! Drink 2-3 cups of water\n😴 Sleep is crucial for recovery\n\n**Timing matters:**\nEating soon after exercise enhances recovery and muscle building.\n\n📚 **More details:** "Exercise Science" module (Learn tab)\n\n⚠️ Not medical advice';
    }

    // Hunger and fullness
    if (query.includes('hunger') || query.includes('appetite') || query.includes('fullness') || query.includes('eating cues')) {
      return '🍽️ **Understanding Hunger & Fullness**\n\n**True hunger signs:**\n• Stomach growling\n• Low energy\n• Difficulty concentrating\n• Mild headache\n• Gradual onset\n\n**Emotional hunger:**\n• Sudden cravings\n• Specific food wants\n• Eating when not physically hungry\n• Triggered by emotions/boredom\n\n**Fullness scale (1-10):**\n1-2: Very hungry, lightheaded\n3-4: Hungry, ready to eat\n5-6: Comfortable, satisfied\n7-8: Full, slightly uncomfortable\n9-10: Stuffed, very uncomfortable\n\n**Goal:** Eat at 3-4, stop at 6-7\n\n**Tips for listening to your body:**\n✓ Eat slowly (20 min per meal)\n✓ Remove distractions (no phone)\n✓ Check in mid-meal\n✓ Stop when comfortable, not stuffed\n\n**Teen challenge:**\nGrowth spurts = increased appetite. This is NORMAL!\n\n📚 **Deep dive:** "Sleep + Stress + Hunger/Cravings" module\n\n⚠️ Not medical advice';
    }

    return null;
  }

  private getFallbackResponse(query: string): string {
    return '💬 **I\'m here to help!**\n\nI didn\'t find specific information about that in our modules, but let me guide you:\n\n**📚 Learn Tab has:**\n• 8 Beginner Modules (quizzes included!)\n• 12 Advanced Research Topics\n• Evidence-based content\n• Singapore-specific examples\n\n**You can ask me about:**\n🥗 Nutrition (protein, carbs, fats, vitamins, fiber)\n🏋️ Exercise (strength, cardio, NEAT)\n😴 Health (sleep, stress, puberty, metabolism)\n🇸🇬 Singapore Food (hawker, bubble tea, chicken rice)\n🔍 Myth-busting\n🧭 App navigation\n🌟 Support and motivation\n🎯 Goal setting\n\n**Try being more specific:**\n• "What is protein?" → Better than "Tell me about nutrition"\n• "How much sleep do teens need?" → Better than "Sleep info"\n\n**Or explore modules directly in Learn tab!**\n\n⚠️ Not medical advice';
  }

  private checkSafety(query: string): boolean {
    const dangerWords = [
      'starve', 'starving', 'skip meals', 'not eating', 'extreme diet',
      'purge', 'vomit', 'laxative', 'harm myself', 'kill myself',
      'anorexia', 'bulimia', 'very low calorie'
    ];
    return dangerWords.some(word => query.includes(word));
  }

  private getSafetyResponse(query: string): string {
    if (query.includes('starve') || query.includes('skip meals') || query.includes('not eating')) {
      return aiKnowledgeBase.safety.refusal_disordered_eating;
    }
    if (query.includes('harm') || query.includes('kill')) {
      return aiKnowledgeBase.safety.refusal_self_harm;
    }
    return '🛡️ **Safety First**\n\nI noticed your question touches on something concerning. Your health and wellbeing matter.\n\nIf you\'re struggling:\n• Talk to a trusted adult\n• Call a helpline\n• See a healthcare provider\n\nI\'m here to support healthy habits, not extreme measures.\n\n⚠️ Not medical advice - please seek professional support.';
  }

  private handleMythBuster(query: string): string {
    // Common myths
    if ((query.includes('carbs') || query.includes('carb')) && (query.includes('bad') || query.includes('fat') || query.includes('avoid'))) {
      return '🔴 **MYTH BUSTED**\n\n❌ "Carbs make you fat"\n✅ TRUTH: Carbs are your brain\'s main fuel! Excess calories from ANY source can lead to weight gain, not carbs specifically.\n\n**From our modules:**\nCarbohydrates provide 4 calories per gram and are the body\'s preferred energy source, especially for your brain and during exercise. Choose quality carbs: whole grains, fruits, vegetables.\n\n💡 **Singapore example:** Brown rice > white rice for more fiber, but both are fine in moderation!\n\n📚 Learn more in: "Macronutrients + Food Quality" module';
    }

    if (query.includes('protein') && (query.includes('kidney') || query.includes('damage') || query.includes('dangerous'))) {
      return '🟡 **NEEDS CONTEXT**\n\n❌ "High protein damages kidneys"\n✅ TRUTH: For healthy teens, protein is safe and essential for growth.\n\n**From advanced topics:**\nResearch shows normal protein intake (1.2-2.0g/kg) is safe for healthy adolescents. Only those with pre-existing kidney conditions need to monitor protein.\n\n**For a 60kg teen:** 72-120g protein daily is appropriate.\n\n📚 Learn more in: "Protein Requirements for Teen Athletes" (Advanced)';
    }

    if (query.includes('skip breakfast') || query.includes('breakfast') && query.includes('important')) {
      return '🟡 **PARTIAL TRUTH**\n\n"Breakfast is the most important meal"\n✅ NUANCED: Eating breakfast can help some teens, but timing matters less than total nutrition.\n\n**From our modules:**\nWhat matters most:\n1. Total daily nutrition\n2. Energy for activities\n3. Not going too long without food\n\nSome teens prefer breakfast, others don\'t. Listen to your hunger cues!\n\n📚 Learn more in: "Meal Timing & Circadian Rhythms" (Advanced)';
    }

    if (query.includes('detox') || query.includes('cleanse') || query.includes('juice cleanse')) {
      return '🔴 **MYTH - RED FLAG**\n\n❌ "Detox diets/cleanses are necessary"\n✅ TRUTH: Your liver and kidneys detox naturally. These diets are unnecessary and potentially harmful for growing teens.\n\n**From our modules:**\nYour body has built-in detoxification systems (liver, kidneys, lungs, skin). No special diet or product is needed.\n\n⚠️ **Warning:** Extreme cleanses can cause:\n• Nutrient deficiencies\n• Energy loss\n• Disrupted growth\n\n📚 Learn more in: "Myths & Misinformation Toolkit" module';
    }

    return '🔍 **Myth Check**\n\nI need more specific details to evaluate this claim.\n\n**Try asking:**\n• "Is it true that carbs make you fat?"\n• "Do I need to detox?"\n• "Is skipping meals healthy?"\n• "Does eating at night cause weight gain?"\n\n📚 Or explore: "Myths & Misinformation Toolkit" module for common misconceptions.';
  }

  private handleNavigator(query: string): string {
    if (query.includes('quiz') || query.includes('test') || query.includes('learn')) {
      return '🧭 **Navigation: Quizzes & Learning**\n\n📍 **To take a quiz:**\n1. Go to **Learn tab** (book icon)\n2. Choose any of the 8 beginner modules\n3. Read the content\n4. Scroll down and tap "Start Quiz"\n5. Answer questions and get instant feedback\n\n💯 Your best scores are saved!\n\n📚 **Available modules:**\nEnergy Balance, Macros, Micros, My Healthy Plate, SG Food, Exercise, Sleep/Stress, Myths';
    }

    if (query.includes('track') || query.includes('log')) {
      return '🧭 **Navigation: Tracking**\n\n📍 **To log data:**\n1. Go to **Track tab** (chart icon)\n2. Tap the big green "Log Today\'s Data" button\n3. Enter nutrition/activity/recovery metrics\n4. Tap "Save"\n\n📊 **View trends:**\nScroll down on Track tab to see 7-day trends and insights!\n\n✨ **Tip:** Log consistently for better pattern recognition.';
    }

    if (query.includes('meal') || query.includes('scan') || query.includes('photo')) {
      return '🧭 **Navigation: Scan Meal Assist**\n\n📍 **To use Scan Meal:**\n1. Go to **Track tab**\n2. Tap "Scan Meal Assist" button\n3. Take/upload a photo (placeholder)\n4. Answer questions about the meal\n5. Review nutrition estimate\n6. Confirm to add to log\n\n📸 Great for hawker food, canteen meals, and bubble tea!';
    }

    if (query.includes('quest') || query.includes('badge') || query.includes('team')) {
      return '🧭 **Navigation: Quests & Teams**\n\n📍 **To join the community:**\n1. Go to **Connect tab** (users icon)\n2. Scroll to see active quests\n3. Tap "Update Progress" on any quest\n4. Earn badges by completing activities\n5. Create/join teams for support\n\n🎯 **Available quests:** Daily and weekly challenges\n🏆 **6 badges** to unlock';
    }

    if (query.includes('journal') || query.includes('reflect') || query.includes('mood')) {
      return '🧭 **Navigation: Journaling**\n\n📍 **To journal:**\n1. Go to **Reflect tab** (pen icon)\n2. Select your current mood (1-10)\n3. Write your thoughts\n4. Add emotion tags (Grateful, Proud, etc.)\n5. Tap "Save Entry"\n\n📈 **View patterns:** See your 7-day mood chart and AI insights!\n🔍 **Search:** Find past entries by keyword or tag';
    }

    if (query.includes('achieve') || query.includes('stats') || query.includes('export')) {
      return '🧭 **Navigation: Progress Tracking**\n\n📍 **Achievements:**\nTap the ⚙️ icon → "View Achievements" to see 18 achievements across 5 categories\n\n📊 **Statistics & Export:**\nTap ⚙️ → "Statistics & Data Export" to:\n• View comprehensive analytics\n• Export data (JSON/CSV)\n• Generate personal reports\n• Track streaks and totals';
    }

    return '🧭 **Navigation Help**\n\n**What are you looking for?**\n\n📚 Learning & Quizzes → Learn tab\n📊 Tracking & Logging → Track tab\n🤝 Quests & Teams → Connect tab\n✍️ Journaling & Mood → Reflect tab\n🤖 AI Questions → You\'re here!\n⚙️ Settings & Profile → Top-right icons\n\nAsk me: "How do I track food?" or "Where are quizzes?"';
  }

  private handleSupport(query: string): string {
    if (query.includes('stress') || query.includes('anxious') || query.includes('overwhelm')) {
      return '🌟 **You\'re Not Alone**\n\n**Feeling stressed is normal.** Your teen years come with unique pressures: school, social media, body changes, expectations.\n\n**Healthy stress management:**\n• Deep breathing (4-7-8 technique)\n• Physical activity (releases endorphins)\n• Talk to someone trusted\n• Journaling (try Reflect tab!)\n• Adequate sleep (8-10 hours)\n• Limit social media\n\n💚 **Remember:** Stress is manageable. You don\'t have to be perfect.\n\n📚 Learn more in: "Sleep + Stress + Hunger/Cravings" module\n\n⚠️ If stress feels unmanageable, talk to a counselor or healthcare provider.';
    }

    if (query.includes('tired') || query.includes('no energy') || query.includes('exhausted')) {
      return '🌟 **Energy Check**\n\n**Common causes of low energy in teens:**\n\n1. **Sleep** (most common!)\n   • Need: 8-10 hours\n   • Try: Regular sleep schedule\n\n2. **Nutrition**\n   • Not eating enough\n   • Skipping meals\n   • Low iron (common in teens)\n\n3. **Stress & Mental Load**\n   • School pressure\n   • Social challenges\n\n4. **Activity Level**\n   • Too much OR too little\n\n💡 **Action steps:**\n✓ Track sleep in Track tab\n✓ Check if eating enough calories\n✓ Consider iron-rich foods (meat, beans, greens)\n\n⚠️ If persistent, see a doctor.';
    }

    if (query.includes('motivation') || query.includes('give up') || query.includes('cant do')) {
      return '🌟 **You\'ve Got This**\n\n**Progress isn\'t linear.** Some days are hard. That\'s normal and okay.\n\n**Key mindset shifts:**\n\n1. **Progress > Perfection**\n   • One healthy choice is a win\n   • Consistency beats intensity\n\n2. **Your Worth ≠ Numbers**\n   • You\'re more than weight/grades/likes\n   • Health supports your life goals\n\n3. **Small Steps Matter**\n   • 10 minutes of movement\n   • One glass of water\n   • One journal entry\n\n💚 **You showed up here. That\'s already progress.**\n\n✨ Try: Set ONE tiny goal for today. Just one.';
    }

    return '🌟 **You Matter**\n\n**Remember:**\n• Progress > Perfection\n• Your worth isn\'t tied to numbers\n• Small consistent steps > Big drastic changes\n• It\'s okay to have hard days\n• Asking for help is strength\n\n💚 **What specific support do you need?**\n\nYou can ask about:\n• Managing stress\n• Staying motivated\n• Handling challenges\n• Building confidence\n\nI\'m here for you. ⚠️ Not therapy - reach out to professionals if struggling.';
  }

  private handleCoach(query: string, context: AIContext): string {
    // Personalized coaching based on query
    if (query.includes('start') || query.includes('begin') || query.includes('where')) {
      return '🎯 **Your Personalized Start**\n\n**Foundation First (Week 1-2):**\n\n1. **Sleep Consistency**\n   • Same bedtime/wake time\n   • 8-10 hours nightly\n   • Track in Track tab\n\n2. **Hydration Baseline**\n   • Target: 8-10 glasses daily\n   • More if active or hot weather\n   • Singapore climate = extra water!\n\n3. **Awareness**\n   • Take Learn module quizzes\n   • Start simple journaling\n   • Notice hunger/fullness cues\n\n**Then build:**\n✓ Add activity you enjoy\n✓ Include all food groups\n✓ Track patterns\n\n💡 **Next:** Complete "Energy Balance + Metabolism Basics" module!';
    }

    if (query.includes('goal') || query.includes('target') || query.includes('objective')) {
      return '🎯 **SMART Goal Setting**\n\n**Make your goal:**\n\n✓ **Specific:** "Walk 10k steps daily" not "be more active"\n✓ **Measurable:** Use Track tab to log\n✓ **Achievable:** Start smaller, build up\n✓ **Relevant:** Matches your priorities\n✓ **Time-bound:** Set a timeframe\n\n**Example Teen Goals:**\n1. "Sleep by 10:30pm on school nights for 2 weeks"\n2. "Eat breakfast 5 days this week"\n3. "Complete 2 Learn modules this month"\n4. "Journal 3x weekly for stress relief"\n\n💡 **Action:** Choose ONE goal. Track progress in Track tab!\n\n⚠️ Avoid: Weight-focused goals. Focus on behaviors instead.';
    }

    if (query.includes('plateau') || query.includes('stuck') || query.includes('not working')) {
      return '🎯 **Breaking Through**\n\n**When progress stalls:**\n\n1. **Review Fundamentals**\n   • Sleep: Getting 8-10 hours?\n   • Stress: Managing it?\n   • Consistency: 80% of days?\n\n2. **Check Expectations**\n   • Change takes 4-6 weeks minimum\n   • Teen bodies fluctuate (normal!)\n   • Non-scale victories count more\n\n3. **Adjust If Needed**\n   • Try different exercise\n   • Add variety to meals\n   • Increase/decrease intensity\n\n💡 **Remember:** Plateaus are normal. Your body adapts.\n\n📚 Read: "Metabolic Adaptation & Set Point Theory" (Advanced)\n\n⚠️ Not medical advice - focus on health, not just results.';
    }

    return '🎯 **Personalized Coaching**\n\n**I can help with:**\n\n📈 **Goal Setting**\n"How do I set realistic goals?"\n\n🚀 **Getting Started**\n"Where should I begin?"\n\n💪 **Specific Areas**\n"How to improve sleep?"\n"Building consistent habits?"\n\n🎓 **Learning Path**\n"Which modules first?"\n\n**What do you need guidance on?**\n\n💡 Tip: Be specific! The more detail, the better I can help.\n\n⚠️ Not medical advice - personalized to healthy habits.';
  }

  private handleAsk(query: string): string {
    // Extract relevant content from modules
    const relevantContent = this.findRelevantContent(query);
    
    if (relevantContent) {
      return relevantContent;
    }

    // Fallback general response
    return '💬 **Let me help you learn!**\n\n**I can answer questions about:**\n\n🥗 **Nutrition:** Protein, carbs, fats, vitamins, fiber\n🏋️ **Exercise:** Strength, cardio, NEAT, teen fitness\n😴 **Health:** Sleep, stress, puberty, metabolism\n🇸🇬 **SG Food:** Hawker centers, bubble tea, smart swaps\n\n**Try asking:**\n• "What is protein for?"\n• "How much sleep do teens need?"\n• "Is bubble tea okay?"\n• "What is NEAT?"\n\n📚 Or explore Learn tab for in-depth modules!\n\n⚠️ Not medical advice - educational information only.';
  }

  private findRelevantContent(query: string): string | null {
    const lowerQuery = query.toLowerCase();

    // Nutrition topics
    if (lowerQuery.includes('protein')) {
      return '🥩 **Protein - The Building Block**\n\n**What it does:**\n• Builds and repairs muscles\n• Supports growth (crucial for teens!)\n• Makes enzymes and hormones\n• Helps immune function\n\n**How much:** ~0.8-1.2g per kg body weight\n(For a 60kg teen: 48-72g daily)\n\n**Sources:**\n• Animal: Chicken, fish, eggs, dairy\n• Plant: Tofu, tempeh, beans, lentils\n• Singapore: Chicken rice, fish soup, egg prata\n\n**Teen tip:** Spread protein across meals for best muscle protein synthesis!\n\n📚 From: "Macronutrients + Food Quality" module\n⚠️ Not medical advice';
    }

    if (lowerQuery.includes('carb')) {
      return '🍚 **Carbohydrates - Your Energy Source**\n\n**What they do:**\n• Primary fuel for brain and muscles\n• 4 calories per gram\n• Spare protein for growth\n• Support gut health (if fiber-rich)\n\n**Types:**\n• Simple: Quick energy (fruits, honey)\n• Complex: Sustained energy (rice, noodles, bread)\n\n**Singapore examples:**\n✓ White/brown rice\n✓ Noodles (bee hoon, mee)\n✓ Wholegrain bread\n✓ Sweet potato\n\n**Myth-bust:** Carbs don\'t make you fat. Excess calories from any source can lead to weight gain.\n\n📚 From: "Macronutrients + Food Quality" module\n⚠️ Not medical advice';
    }

    if (lowerQuery.includes('fat') && !lowerQuery.includes('get fat') && !lowerQuery.includes('make fat')) {
      return '🥑 **Fats - Essential for Health**\n\n**What they do:**\n• Absorb fat-soluble vitamins (A,D,E,K)\n• Support brain function (60% of brain is fat!)\n• Provide energy (9 cal/gram)\n• Make hormones (crucial during puberty)\n\n**Types:**\n• Unsaturated (healthy): Nuts, fish, avocado, olive oil\n• Saturated (moderate): Dairy, meat, coconut oil\n• Trans fats (avoid): Processed foods\n\n**Singapore sources:**\n✓ Fish (omega-3)\n✓ Nuts and seeds\n✓ Cooking oils\n\n**How much:** ~20-35% of total calories\n\n📚 From: "Macronutrients + Food Quality" module\n⚠️ Not medical advice';
    }

    if (lowerQuery.includes('fiber') || lowerQuery.includes('fibre')) {
      return '🌾 **Fiber - The Gut Hero**\n\n**What it does:**\n• Supports digestion and gut health\n• Keeps you full longer\n• Helps regulate blood sugar\n• Reduces disease risk\n\n**Teen target:** 25-30g daily\n\n**Sources:**\n• Fruits with skin\n• Vegetables\n• Wholegrain rice/bread\n• Beans and lentils\n• Oats\n\n**Singapore tips:**\n✓ Choose brown rice over white\n✓ Add vegetables to chicken rice\n✓ Pick wholegrain bread\n✓ Eat fruits with skin\n\n**Easy win:** One extra serving of veggies = ~5g fiber!\n\n📚 From: "Micronutrients + RDA Essentials" module\n⚠️ Not medical advice';
    }

    if (lowerQuery.includes('sleep')) {
      return '😴 **Sleep - Teen Priority #1**\n\n**Why teens need MORE sleep:**\n• Brain development continues until 25\n• Growth hormone released during sleep\n• Learning consolidation\n• Mood regulation\n\n**Target: 8-10 hours nightly**\n\n**Poor sleep effects:**\n• Increased hunger (ghrelin hormone)\n• Decreased fullness signals\n• Lower energy for activity\n• Impaired decision-making\n• Mood swings\n\n**Teen sleep tips:**\n✓ Consistent bed/wake times\n✓ Dark, cool room\n✓ No screens 30-60min before bed\n✓ Wind-down routine\n✓ Avoid caffeine after 2pm\n\n💡 Track sleep in Track tab to spot patterns!\n\n📚 From: "Sleep + Stress + Hunger/Cravings" module\n⚠️ Not medical advice';
    }

    if (lowerQuery.includes('stress')) {
      return '😰 **Stress & Your Body**\n\n**What stress does:**\n• Releases cortisol (stress hormone)\n• Increases appetite (especially cravings)\n• Disrupts sleep\n• Affects digestion\n• Impacts mood\n\n**Teen stress sources:**\n• School pressure\n• Social media comparison\n• Body changes (puberty)\n• Future worries\n• Peer relationships\n\n**Healthy stress management:**\n✓ Physical activity (reduces cortisol)\n✓ Deep breathing (4-7-8 technique)\n✓ Journaling (use Reflect tab!)\n✓ Talk to trusted adults\n✓ Adequate sleep\n✓ Time in nature\n\n💡 High stress = harder to make healthy choices. Be gentle with yourself.\n\n📚 From: "Sleep + Stress + Hunger/Cravings" module\n⚠️ Not medical advice - seek support if overwhelming';
    }

    if (lowerQuery.includes('metabolism')) {
      return '⚡ **Metabolism - Your Energy System**\n\n**What it is:**\nAll chemical reactions in your body that convert food to energy.\n\n**Components:**\n1. **BMR** (60-70%): Basic functions at rest\n2. **Activity** (15-30%): Exercise & movement\n3. **TEF** (10%): Digesting food\n4. **NEAT**: Non-exercise movement\n\n**Teen metabolism:**\n• HIGHER than adults (growth!)\n• Influenced by genetics, age, sex, muscle mass\n• Can adapt to consistent under/overeating\n\n**Metabolism myths:**\n❌ "Eating breakfast boosts metabolism" (minimal effect)\n❌ "Small frequent meals boost metabolism" (total calories matter more)\n✅ Building muscle increases BMR\n✅ Being active increases TDEE\n\n📚 From: "Energy Balance + Metabolism Basics" module\n⚠️ Not medical advice';
    }

    if (lowerQuery.includes('neat')) {
      return '🚶 **NEAT - The Hidden Calorie Burner**\n\n**What is NEAT?**\nNon-Exercise Activity Thermogenesis = all movement outside of formal exercise.\n\n**Examples:**\n• Walking to school\n• Taking stairs\n• Fidgeting\n• Household chores\n• Standing vs. sitting\n• Shopping, playing\n\n**Why it matters:**\nNEAT can vary by 2000 calories/day between people! More impactful than 1-hour gym session.\n\n**Boost NEAT:**\n✓ Walk instead of bus (when safe)\n✓ Take stairs\n✓ Stand while studying (sometimes)\n✓ Active breaks between homework\n✓ Weekend activities\n\n**Singapore context:**\nWalking to MRT, shopping at malls, exploring parks all count!\n\n📚 From: "Exercise Science" module + Advanced "NEAT" topic\n⚠️ Not medical advice';
    }

    // Singapore food specific
    if (lowerQuery.includes('bubble tea') || lowerQuery.includes('bbt')) {
      return '🧋 **Bubble Tea - The Singapore Way**\n\n**Nutritional reality:**\n• Regular (100% sugar): ~400-500 calories\n• 50% sugar: ~300-350 calories\n• 0% sugar: ~200-250 calories (from milk/toppings)\n\n**Smart choices:**\n✓ 0-50% sugar level\n✓ No toppings OR less toppings\n✓ Fresh milk > creamer\n✓ Smaller size (regular, not large)\n\n**Frequency:**\nOccasional treat (1-2x/week), not daily habit\n\n**Why:**\nAdded sugar recommendation for teens: <25g/day. A full-sugar BBT has 50-70g!\n\n**Balance:**\nIf you have BBT, maybe skip dessert that day. It\'s about overall pattern, not perfection.\n\n📚 From: "Singapore Food Environment" module\n⚠️ Not medical advice - enjoy mindfully!';
    }

    if (lowerQuery.includes('chicken rice')) {
      return '🍗 **Chicken Rice - National Dish Nutrition**\n\n**Typical meal (~650-800 calories):**\n• White rice cooked in chicken fat\n• Steamed/roasted chicken\n• Soup, cucumber, chili\n\n**Pros:**\n✓ Good protein (chicken)\n✓ Balanced meal\n✓ Not heavily processed\n\n**Make it better:**\n✓ More vegetables (order extra cucumber, soup veggies)\n✓ Choose white meat if less fat preferred\n✓ Watch portion size of rice\n✓ Skip sugary drinks\n\n**Frequency:**\nGreat for lunch/dinner several times a week!\n\n**Singapore reality:**\nChicken rice is one of the healthier hawker options. Don\'t stress about enjoying it regularly.\n\n📚 From: "Singapore Food Environment" module\n⚠️ Not medical advice';
    }

    if (lowerQuery.includes('hawker') || lowerQuery.includes('canteen')) {
      return '🍜 **Navigating Hawker Centers & Canteens**\n\n**Healthier choices:**\n✓ Mixed vegetable rice (more veggies, less rice)\n✓ Soup noodles (less oil than fried)\n✓ Fish/chicken (lean protein)\n✓ Yong tau foo (choose more veg pieces)\n✓ Western grilled options\n\n**Watch portions:**\n⚠️ Economic rice (easy to overload)\n⚠️ Fried options (hidden oil)\n⚠️ Sugary drinks (order water/tea instead)\n\n**Smart swaps:**\n• Fried → Grilled/steamed\n• Sugary drink → Water/unsweetened tea\n• All carbs → Add 1 veg portion\n• Extra gravy → Less gravy\n\n**Balance:**\nNo single meal ruins anything. Focus on patterns across days!\n\n📚 From: "Singapore Food Environment" module\n⚠️ Not medical advice';
    }

    // Exercise topics
    if (lowerQuery.includes('exercise') || lowerQuery.includes('workout')) {
      return '🏃 **Exercise for Teens**\n\n**Recommendations:**\n• 60 minutes moderate-vigorous activity daily\n• Includes PE class, sports, play\n• Mix of cardio, strength, flexibility\n\n**Types:**\n1. **Cardio:** Running, swimming, cycling, dancing\n2. **Strength:** Bodyweight, resistance bands, weights\n3. **Flexibility:** Stretching, yoga\n\n**Teen benefits:**\n• Supports bone development\n• Builds muscle during growth\n• Improves mood and focus\n• Better sleep\n• Stress relief\n\n**Singapore options:**\n✓ School PE and sports CCAs\n✓ ActiveSG programs\n✓ Community parks and gyms\n✓ Walking/cycling\n\n💡 Best exercise = one you enjoy and do consistently!\n\n📚 From: "Exercise Science" module\n⚠️ Not medical advice';
    }

    if (lowerQuery.includes('strength') || lowerQuery.includes('weight')) {
      return '💪 **Strength Training for Teens**\n\n**Is it safe?**\nYES! Research shows strength training is safe and beneficial for teens when done properly.\n\n**Benefits:**\n• Builds muscle and bone density\n• Improves sports performance\n• Supports healthy metabolism\n• Boosts confidence\n• Develops movement skills\n\n**Teen guidelines:**\n✓ Focus on form over weight\n✓ Bodyweight first (push-ups, squats)\n✓ Supervised if using weights\n✓ 2-3x per week\n✓ Full recovery between sessions\n\n**Myth-bust:**\n❌ "Weights stunt growth" - FALSE, no evidence\n✅ Proper training supports healthy development\n\n**Start simple:**\nPush-ups, squats, lunges, planks at home!\n\n📚 From: "Exercise Science" + Advanced "Resistance Training Safety"\n⚠️ Not medical advice';
    }

    // Puberty and teen-specific
    if (lowerQuery.includes('puberty') || lowerQuery.includes('hormones') || lowerQuery.includes('teen body')) {
      return '🌱 **Puberty & Your Changing Body**\n\n**Normal changes (ages 10-19):**\n• Height spurts (growth velocity)\n• Body composition changes\n• Increased appetite (growth!)\n• Mood fluctuations\n• Skin changes\n• Development of secondary sexual characteristics\n\n**Nutritional needs INCREASE:**\n• Calories: Support growth\n• Protein: Build new tissue\n• Calcium: Bone development\n• Iron: Especially for girls (menstruation)\n\n**Key points:**\n• Weight gain is NORMAL and NECESSARY\n• Body changes are part of healthy development\n• Everyone develops at different rates\n• Comparing to others is unhelpful\n\n**Red flags:**\nExtreme dieting during puberty can:\n• Delay development\n• Affect bone health\n• Impact fertility later\n\n📚 From: Advanced "Hormonal Changes During Puberty"\n⚠️ Not medical advice - celebrate your growth!';
    }

    if (lowerQuery.includes('body image') || lowerQuery.includes('social media') || lowerQuery.includes('appearance')) {
      return '📱 **Body Image & Social Media**\n\n**The reality:**\n• 90% of images are edited/filtered\n• Social media shows highlights, not reality\n• Algorithms show idealized content\n• Comparison is unfair (different genetics, ages, lives)\n\n**Teen challenges:**\n• Constant exposure to unrealistic standards\n• Peer pressure and bullying\n• Puberty changes happening\n• Identity formation\n\n**Healthy practices:**\n✓ Curate your feed (unfollow harmful accounts)\n✓ Follow diverse, real bodies\n✓ Limit social media time\n✓ Challenge negative thoughts\n✓ Focus on what your body can DO\n\n**Your worth ≠ appearance**\n\n**Remember:**\nYour body is changing to support adult you. Health > appearance always.\n\n📚 From: Advanced "Body Image, Social Media & Mental Health"\n⚠️ If struggling, talk to a counselor';
    }

    return null; // No specific content found
  }
}

export const aiEngine = new AIEngine();
