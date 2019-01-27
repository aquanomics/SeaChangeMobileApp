npm install these please :D


react-native-elements
moment
react-native-vector-icons

react-native-firebase
react-native-navigation
react-native-gesture-handler
react-native-maps
react-native-modal-dropdown

//For Post feature
Step 1). npm install --save react-native-image-picker
         react-native link react-native-image-picker

Step 2). modify ios/SeaChangeMobileApp/Info.plist by adding:
<key>NSPhotoLibraryUsageDescription</key>
<string>For choosing a photo.</string>
<key>NSCameraUsageDescription</key>
<string>For taking a photo.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>For saving a photo.</string>

Step 3). modify app/src/main/AndroidManifest.xml by adding:
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

-. npm install react-native-textinput-effects
////////////////////