// Vistas/LogIn_Front.js (refactor visual y UX)
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LogIn_Front({
  username,
  password,
  onChangeUsername,
  onChangePassword,
  onSubmit,
  // props opcionales para front
  isLoading = false,
  errorMessage = '',
  onForgotPassword = () => {},
}) {
  const canSubmit = username?.trim()?.length > 0 && password?.trim()?.length > 0 && !isLoading;

  const handleSubmit = () => {
    if (canSubmit) onSubmit?.();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
          <View style={styles.headerWrap}>
          </View>

          <View style={styles.loginCard} accessibilityRole="form" accessible>
            <Text style={styles.title}>Log In</Text>
            <Text style={styles.subtitle}>Welcome</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#9AA0A6"
                value={username}
                onChangeText={onChangeUsername}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                accessibilityLabel="Campo de usuario"
                selectionColor="#2563EB"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9AA0A6"
                value={password}
                onChangeText={onChangePassword}
                secureTextEntry
                textContentType="password"
                accessibilityLabel="Campo de contraseña"
                selectionColor="#2563EB"
              />
            </View>

            {Boolean(errorMessage) && (
              <Text style={styles.errorText} accessibilityLiveRegion="polite">{errorMessage}</Text>
            )}

            <TouchableOpacity
              style={[styles.loginButton, !canSubmit && styles.loginButtonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit }}
            >
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>

          <StatusBar style="dark" />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerWrap: { position: 'absolute', top: 24, left: 0, right: 0, alignItems: 'center' },
  brand: { fontSize: 20, fontWeight: '800', letterSpacing: 0.5, color: '#111827' },
  loginCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#99b8f5ff',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputContainer: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#020873',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#020873',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonDisabled: { backgroundColor: '#226bacff', shadowOpacity: 0.1 },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 14,
    color: '#1216f2ff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  errorText: { color: '#B91C1C', marginBottom: 8, textAlign: 'center' },
});
