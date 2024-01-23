# Rainbow SDK for React Native



## Rainbow-React-Native-SDK-Sample APP

Welcome to the Alcatel-Lucent Enterprise **Sample code for React Native**!

This repo provides a basic sample application you can use it for starting your development using the SDK for React Native and
to check some of the Rainbow features provide by the Rainbow RN SDK.


## Preamble

You must have a valid Rainbow account on sandbox to be able to login and test.

If you have this error : Unknown application or wrong token for application id YOUR_APPLICATION_ID when you attempt to login, please enter your own application id and application secret or try to remove default values in Application class.

You can find more information about application id and application secret at [hub.openrainbow.com](https://hub.openrainbow.com/#/documentation/doc/hub/developer-sandboxed-platform)


## Installation

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

make sure to run npm install before you run the app.
## Content

This sample application for React Native SDK provide the following features:

- **Conversations** - manage list of conversations - chat and bubbles.
- **Contacts** - manage list of contacts and make a native call to a contact.
- **WebRTC** - make or take audio/video call.
- **Telephony** - make or  PBX call and manage telephony settings.
- **Invitations** - manage list of sent and received invitations. Accept, reject or resend the invitation.
- **CallLogs** - manage all the calls history and the missed calls.
- **ForgotPassword** - reset your password account.
- **Search for Contact** - search for contact by name.
- **Enabling Push Notifications**

