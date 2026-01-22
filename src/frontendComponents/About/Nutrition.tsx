import React from 'react';
import { Heart, Leaf, Shield, Sparkles } from 'lucide-react';

const NutritionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      {/* <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 to-orange-800/90 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=1600&h=900&fit=crop')"
          }}
        ></div>
        <div className="relative z-20 text-center text-white px-4">
          <p className="text-amber-300 uppercase tracking-widest text-sm mb-4 font-light">Product / Nutrition</p>
          <h1 className="text-6xl md:text-7xl font-bold mb-6">NUTRITION</h1>
          <div className="w-24 h-1 bg-amber-300 mx-auto"></div>
        </div>
      </section> */}

      <section
        className="relative w-full overflow-hidden pt-[120px]"
        style={{
          backgroundImage: "url('/assets/Image/bg-banner.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto flex min-h-[260px] max-w-7xl items-center justify-center px-5 py-14 md:min-h-[320px]">
          <div className="text-center">
            <h1 className="text-3xl font-bold uppercase md:text-5xl">
              Nutrition
            </h1>
          </div>
        </div>
      </section>
      

      {/* Intro Section */}
      <section className="mx-auto px-4 py-20 bg-white">
        <div className="text-center  max-w-6xl mx-auto">
          <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-4">
            We value our simplicity
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            IN BOTH THE PROCESS AND INGREDIENTS
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
            Our peanuts are not only delicious and the perfect go-to snack, but they are also extremely healthy and beneficial to our diet. Unlike most snacks, our peanuts are not filled with unhealthy oils and unnatural ingredients. We always emphasize our simplicity in ingredients. People rarely find products that only contain two ingredients, and we are so proud to display our ingredients list. Through our unique roasting process, we do not need any artificial flavorings or preservatives to make our peanuts taste.
          </p>
        </div>
      </section>

      {/* Two Ingredients Section */}
      <section className="bg-[#070707] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-amber-400 uppercase tracking-wider text-sm font-semibold mb-4">
              Two Ingredients
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              NOTHING MORE, IT'S THAT SIMPLE
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Salt Card */}
            <div className="bg-white rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="h-64 bg-gray-900 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=600&h=400&fit=crop"
                  alt="Sea salt on wooden spoon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-3xl font-bold  mb-4">SALT</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Only a dash of natural sea salt is added into our peanuts so they won't taste unnaturally salty and has just the right amount of flavor.
                </p>
              </div>
            </div>

            {/* Peanuts Card */}
            <div className="bg-white rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="h-64 bg-gray-900 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1651004276154-0e42a8b98e2b?w=600&h=400&fit=crop"
                  alt="Fresh peanuts"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-3xl font-bold  mb-4">PEANUTS</h3>
                <p className="text-gray-600  text-lg leading-relaxed">
                  Freshly roasted in our industry, peanuts are shipped on a regular basis to guarantee that only the most recent peanuts are packaged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition Benefits Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-4">
              Nutrition
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              NUTRITION
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Peanuts are packed with rich nutrients like protein, minerals, antioxidants, and fiber. Not only that, peanuts also contain a high amount of healthy fats. A common misconception is that fats are unhealthy and lead to weight gain. What most people fail to realize is that there are multiple different types of fats. While some fats, like trans fat, can damage our health, others, like unsaturated fat, have many functions in helping our diet.
              </p>
              <p>
                Fortunately, peanuts are 80% unsaturated fat! Unsaturated fats are actually essential to our health and are commonly used for energy and has also been known to help reduce cholesterol levels. People who are trying to lose weight or change their diet, often swap their unhealthy desserts with peanuts to help reduce cravings and curb their appetite.
              </p>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/khfood-img.png"
              alt="Growing plant"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Health Benefits Section */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-4">
              Health
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              WHAT ARE THE HEALTH BENEFITS OF EATING PEANUTS?
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
              According to Harvard Medical School's Health Publishing, peanuts along with other tree nuts, help reduce the chance of heart disease or any fatal death causing diseases. This fulfilling snack is perfect for people to enjoy on a regular basis with guilt free happiness.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">A HEALTHY ALTERNATIVE</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Peanuts have helped people control both their insulin levels and blood sugar because peanuts are low on sugar. The Diabetic Council recommends individuals diagnosed with diabetes or those who suffer with high insulin levels to eat peanuts because they are low in carbohydrates and high in fiber. Peanuts are a tasty alternative that can replace snacks that contain mostly carbohydrates and sugar.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">NUTRIENT RICH</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Packed with protein, healthy fats, vitamins, and minerals, peanuts provide essential nutrients that support overall health and wellbeing. They're an excellent source of energy and help keep you satisfied throughout the day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Peanut Institute Link */}
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <img 
              src="https://peanut-institute.com/wp-content/uploads/2021/03/peanut-institute-logo.png"
              alt="The Peanut Institute"
              className="h-20 mx-auto mb-6"
            />
            <p className="text-gray-700 mb-6">
              To learn more about the benefits and nutrition of peanuts click on the following link
            </p>
            <a 
              href="https://peanut-institute.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Visit Peanut Institute
            </a>
          </div>
        </div>
      </section>

      {/* Features Footer */}
      <section className="bg-gradient-to-r from-amber-400 to-orange-500 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">FREE SHIPPING</h4>
              <p className="text-sm">All domestic orders</p>
            </div>
            <div className="text-center text-white">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">SECURE PAYMENTS</h4>
              <p className="text-sm">Confirm</p>
            </div>
            <div className="text-center text-white">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">CUSTOMER PRIORITY</h4>
              <p className="text-sm">Quick responses</p>
            </div>
            <div className="text-center text-white">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">MADE WITH LOVE</h4>
              <p className="text-sm">Best services</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NutritionPage;