# VidhiVaani 🏛️⚖️

**Your Personal Indian Legal Assistant**

VidhiVaani is a React Native mobile application that provides AI-powered legal guidance for everyday Indian legal scenarios. Built with Expo and powered by Google's Gemini 2.5-Flash, it offers clear, situation-specific advice on constitutional rights, legal procedures, and practical next steps.

## 📱 Features

### 🎯 **Comprehensive Legal Coverage**
- **Constitutional Law**: Fundamental Rights, DPSPs, reasonable restrictions
- **Criminal Law**: Police powers, arrests, searches, FIRs, CrPC procedures  
- **Civil Law**: Property, contracts, torts, CPC procedures
- **Traffic & Motor Vehicle**: Challans, licenses, traffic stops, MV Act
- **Consumer Rights**: Complaints, forums, consumer protection
- **Labour Law**: Employment rights, workplace issues
- **Cyber Law**: Online crimes, IT Act violations
- **Family Law**: Marriage, divorce, custody, domestic violence
- **Tenancy**: Rent disputes, eviction, tenant rights

### 💬 **Smart Interaction Flow**
- **Short Answers First**: Quick 3-5 sentence responses with immediate actionable steps
- **Optional Deep Dive**: Detailed explanations available on request
- **Contextual Questions**: Tailored follow-ups based on location, role, and situation
- **Rights-Aware Guidance**: Safety-first, compliance-forward approach

### 🛡️ **User-Centric Design**
- Clean, intuitive chat interface
- Real-time typing indicators
- Error handling with user-friendly messages
- Chat history with reset functionality
- Keyboard-aware UI with proper scroll behavior

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Google AI API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YashvardhanShekhar/vidhivaani.git
   cd vidhivaani
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_google_ai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - **iOS**: Press `i` or scan QR code with Expo Go
   - **Android**: Press `a` or scan QR code with Expo Go

## 🏗️ Project Structure

```
vidhivaani/
├── app/                    # Expo Router pages
│   ├── index.tsx          # Home/Chat screen
│   ├── _layout.tsx        # Root layout
│   └── ChatScreen.tsx     # Main chat interface
├── services/              # API and utility services
│   └── geminiService.js   # Google Gemini API integration
├── components/            # Reusable UI components
├── assets/               # Images, fonts, etc.
├── .env                  # Environment variables
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── README.md           # This file
```

## 🔧 Technical Implementation

### **API Integration**
- **REST API Approach**: Uses direct HTTP calls to Google Gemini API instead of SDK for better React Native compatibility
- **Model**: Gemini 2.5-Flash for optimal performance and cost efficiency
- **Chat History Management**: Maintains conversation context with proper validation
- **Error Handling**: Comprehensive error catching with user-friendly messages

### **Key Components**

#### **ChatScreen** (`app/ChatScreen.tsx`)
- Main chat interface with FlatList for message display
- Real-time typing indicators and loading states
- Keyboard-aware layout with proper scroll behavior
- Message validation and error display

#### **geminiService** (`services/geminiService.js`)
- REST API wrapper for Google Gemini
- Chat history validation and cleaning
- Comprehensive system instructions for legal expertise
- Input/output validation and sanitization

### **Solved Compatibility Issues**
- ✅ **Metro Bundler**: Resolved `@google/genai` import conflicts
- ✅ **React Fragment**: Fixed style prop warnings in Expo Router
- ✅ **API Format**: Corrected model name format and request structure
- ✅ **Environment Variables**: Proper Expo environment variable setup

## 📖 Usage Examples

### **Traffic Stop Scenario**
```
User: "A policeman is asking me to show my Aadhaar card during a traffic check"

VidhiVaani: "During routine traffic checks, you generally need to show your driving licence, registration certificate, insurance, and PUC; Aadhaar isn't usually mandatory unless needed for a specific investigation. Offer your licence first (physical or DigiLocker), keep it polite, and note the officer's details. Want a detailed answer?"
```

### **Property Dispute**
```
User: "My landlord is asking me to vacate without notice"

VidhiVaani: "Landlords must provide proper notice as per your rental agreement and local tenancy laws - typically 1-3 months depending on your state and lease terms. You have rights against arbitrary eviction. Document all communications and don't vacate without following legal process. Want a detailed answer?"
```

## 🔐 Security & Privacy

- **No Data Storage**: Conversations aren't permanently stored
- **API Security**: Secure HTTPS communication with Google AI
- **Environment Protection**: API keys stored in environment variables
- **Input Validation**: All user inputs validated and sanitized

## 🛠️ Development

### **Available Scripts**

```bash
# Start development server
npm start

# Start with cache cleared
npm run start:clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run tests
npm test

# Build for production
npm run build
```

### **Adding New Features**

1. **Legal Domain Expansion**: Update system instructions in `geminiService.js`
2. **UI Components**: Add reusable components in `components/` directory
3. **New Screens**: Create new routes in `app/` directory using Expo Router
4. **API Enhancements**: Extend `geminiService.js` with new functions

## 📱 Deployment

### **Expo Build Service (EAS)**

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure build**
   ```bash
   eas build:configure
   ```

3. **Build for Android/iOS**
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

### **Environment Variables in Production**
Ensure `EXPO_PUBLIC_GEMINI_API_KEY` is set in your production environment or EAS secrets.

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Contribution Guidelines**
- Follow existing code style and patterns
- Add proper error handling and validation
- Update README for new features
- Test on both iOS and Android
- Ensure legal accuracy for law-related changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI**: For providing the Gemini API
- **Expo Team**: For the excellent React Native framework
- **Indian Legal System**: For the comprehensive legal knowledge base
- **Open Source Community**: For the various libraries and tools used

## ⚖️ Legal Disclaimer

VidhiVaani provides general legal information and guidance based on Indian law. This app:

- **Does NOT constitute legal advice**
- **Cannot replace consultation with qualified lawyers**
- **Information may become outdated** - always verify current laws
- **Not responsible for legal outcomes** based on app guidance
- **Recommends professional legal consultation** for serious matters

**For urgent legal matters, consult qualified legal professionals immediately.**

***

**Made with ❤️ for Indian Citizens seeking legal clarity**