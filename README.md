### build release with code signing using EAS locally

It moves everything to a temp folder, execute prebuild, add variables defined in eas.json profile

eas build --platform android --profile production --local

### build release manually

1. prebuild with env variables

export EXAMPLE=true && npx expo prebuild -p android --clean

2. use android studio, react-native cli or expo cli

npx react-native build-android --mode "release"

npx expo run:android --variant release

## testing in PoS machine without internet connection

npm run start -- --localhost

adb reverse tcp:8000 tcp:8000

## patch package

npx patch-package react-native-reanimated --include android/src/

## bootsplash

npx react-native-bootsplash generate assets/images/logo.png \
 --platforms=android,ios \
 --background=#F5F5F7 \
 --logo-width=100 \
 --flavor=main

## black screen error on reload

But for me even with bootsplash the **unrecoverable** black screen still occur in some cases when a "redbox" error appear and i try to reload manually or save the file to trigger the reload.
