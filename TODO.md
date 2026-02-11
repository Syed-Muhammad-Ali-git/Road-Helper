# RoadHelper App Fixes TODO

## Intro/Splash Screens
- [x] Remove IntroOverlay from LandingHomeClient.tsx to eliminate duplicate intro
- [x] Update app/page.tsx: Change to localStorage with key "rh_splash_seen", check only for path "/" and first visit
- [x] Fix ESLint error in app/page.tsx by using lazy initial state
- [x] Update SplashScreen.tsx: Make skip immediate by setting progress/boot to 100 and hiding immediately on skip

## Theme System
- [ ] Ensure theme applies to all components (check headers, sidebars, etc.)
- [ ] Verify theme persistence with localStorage

## Language (i18n + RTL)
- [ ] Complete Urdu translations in dictionaries/ur.json
- [ ] Apply RTL everywhere for Urdu language
- [ ] Test language switching

## Headers/Sidebars
- [ ] Check theme application in customerHeader/header.tsx
- [ ] Check theme application in helperHeader/header.tsx
- [ ] Check theme application in customerSidebar/sidebar.tsx
- [ ] Check theme application in helperSidebar/sidebar.tsx

## Animations
- [ ] Add missing animations to components
- [ ] Ensure smooth transitions

## Images
- [ ] Fix image paths to use /public/assets/images/...
- [ ] Verify all images load correctly

## Responsiveness
- [ ] Ensure app works from 300px width
- [ ] Test on various screen sizes

## Build/Lint
- [ ] Run build and fix all warnings/errors
- [ ] Run lint and fix issues

## Route Change Loader
- [ ] Implement fast global loader for route changes
- [ ] Test loader on navigation

## Testing
- [ ] Test skip intro functionality
- [ ] Test themes
- [ ] Test language switching
- [ ] Test images
- [ ] Test responsiveness
- [ ] Test all features end-to-end
