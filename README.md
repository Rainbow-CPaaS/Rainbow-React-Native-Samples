<div align="center">
  <h1>🚀 Rainbow SDK for React Native</h1>
  <p>
    A production-ready sample application showcasing the power of <a href="https://developers.openrainbow.com/doc/sdk/reactnative/overview">Rainbow's React Native SDK</a>.
    Get started with real-time communication features in minutes, not hours.
  </p>
  
  [![React Native](https://img.shields.io/badge/React_Native-0.79.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)
  [![npm package](https://img.shields.io/npm/v/react-native-rainbow-module?color=blue&label=npm%20package)](https://www.npmjs.com/package/react-native-rainbow-module)
</div>

> 💡 **New to Rainbow SDK?** This sample app is the fastest way to explore all features with zero configuration. For existing projects, you can still use this as a reference implementation.

## ✨ Why Use This Sample App?

### 🎯 For Explorers
- **Zero Configuration** - Just clone and run
- **Feature Showcase** - See all Rainbow capabilities in action
- **Learning Resource** - Study production-grade implementation

### 🛠 For Developers
- **Production-Ready** - Follows best practices
- **Modular Architecture** - Easy to extract and reuse components
- **TypeScript Support** - Better developer experience with type safety

### 🔍 Key Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | Seamless login/logout and session management |
| **💬 Conversations** | 1-to-1 and group chats with rich media support |
| **👥 Contacts** | Full contact management and presence |
| **📞 WebRTC** | Crystal-clear audio/video calls |
| **👨‍👩‍👧‍👦 Conferences** | Multi-party video conferencing |
| **📎 File Sharing** | Secure file transfers in conversations |
| **👥 Invitations** | Manage list of sent and received invitations. Accept, reject or resend the invitation. |
| **📞 CallLogs** | Manage all the calls history and the missed calls. |
| **👥 ForgotPassword** | Reset your password account. |
| **👥 Search for Contact** | Search for contact by name. |

## 🚀 Getting Started in 5 Minutes

1. **Clone and Install**
   ```bash
   git clone https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples.git
   cd Rainbow-React-Native-Samples
   yarn install
   ```

2. **Get API Credentials**
   - Create an account at [Rainbow Developer Hub](https://hub.openrainbow.com/)
   - Register a new application to get your `AppID` and `AppSecret`

3. **Configure** (Choose your platform)

   <details>
   <summary>Android Setup</summary>
   
   Edit `android/app/src/main/assets/rainbow-config.json` and add your application credentials in the appropriate environment object:
   ```json
   {
       "HOST": "openrainbow.com",
       "APP_ID": "YOUR_APP_ID",
       "SEC_KEY": "YOUR_APP_SECRET"
   }
   ```
   
   Choose the correct environment (openrainbow.com, openrainbow.net, or sandbox.openrainbow.com) and replace the placeholder values with your actual application credentials.
   
   Then run:
   ```bash
   yarn android
   ```
   </details>

   <details>
   <summary>iOS Setup</summary>
   
   Edit `ios/rainbow-config.json` and add your application credentials in the appropriate environment object:
   ```json
   {
       "HOST": "openrainbow.com",
       "APP_ID": "YOUR_APP_ID",
       "SEC_KEY": "YOUR_APP_SECRET"
   }
   ```
   
   Choose the correct environment (openrainbow.com, openrainbow.net, or sandbox.openrainbow.com) and replace the placeholder values with your actual application credentials.
   
   Then run:
   ```bash
   cd ios && pod install && cd ..
   yarn ios
   ```
   </details>

## 🔧 Troubleshooting

Common issues and solutions are documented in our [Troubleshooting Guide](TROUBLESHOOTING.md).

Quick fixes for common problems:

```bash
# Clean and rebuild
cd android && ./gradlew clean && cd ..
yarn install

# Reset Metro cache
yarn start --reset-cache
```

## 📚 Documentation & Resources

- [📘 API Reference](https://developers.openrainbow.com/doc/sdk/reactnative/api/Events)
- [📋 Changelog](https://developers.openrainbow.net/doc/sdk/reactnative/tutorials/what_is_new)


## 🤝 Contributing

We love contributions! Whether it's:
- 🐛 Reporting bugs
- 📝 Improving documentation
- 💻 Submitting fixes or features

Please read our [Contributing Guide](CONTRIBUTING.md) to get started.
---

If you encounter any issues, please [open an issue](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/issues) on our GitHub repository.

## 📱 Supported Platforms

- **Android**: 6.0 (API Level 23) and aboveß
- **iOS**: 12.0 and above

## 🔄 Upgrading

When upgrading to a new version of the Rainbow SDK, make sure to:

1. Update the SDK version in `package.json`
2. Run `yarn install` or `npm install`
3. For iOS: `cd ios && pod install && cd ..`
4. Clean and rebuild your project

