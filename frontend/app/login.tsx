import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native"
import { Link, router } from "expo-router"
import { MotiView } from "moti";
import { useAuth } from "../hooks/useAuth"
import * as SecureStore from "expo-secure-store";
import uuid from "react-native-uuid"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_BASE = "http://192.168.0.152:5000/api"

export default function Login() {
    const { login, guestLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("missing fields")
        }
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                setLoading(false);
                return Alert.alert("Login failed", data.message);
            }

            // remove guest token if exists and save user token
            await login(data.token);

            router.replace("/(tabs)");
        } catch (e) {
            Alert.alert("Error", "Unable to login");
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = async () => {
        let guestId = await SecureStore.getItemAsync("guest_token");

        if (!guestId) {
            guestId = uuid.v4().toString();
            await SecureStore.setItemAsync("guest_token", guestId);

            // create empty favorites list ONLY if not created before
            const key = `guest_favorites_${guestId}`;
            const exists = await AsyncStorage.getItem(key);

            if (!exists) {
                await AsyncStorage.setItem(key, JSON.stringify([]));
            }
        }
        // delete old real token if exists
        guestLogin(guestId);
        router.replace("/(tabs)");
    };

    return (
        <View className="flex-1 bg-background dark:bg-darkBackground px-6 justify-center">
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 500 }}
            >
                <Text className="text-3xl items-center font-bold text-primary dark:text-darkPrimary mb-6">
                    Welcome Back
                </Text>
                {/* Email */}
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    className="bg-gray-500 dark:bg-darkPrimary rounded-xl px-4 py-3 mb-4 text-text dark:text-darkText">
                </TextInput>
                {/* Password */}
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    className="bg-gray-500 dark:bg-darkPrimary rounded-xl px-4 py-3 mb-4 text-text dark:text-darkText"
                >
                </TextInput>
                {/* Login button */}
                <Pressable
                    onPress={handleLogin}
                    className="bg-primary dark:dakrPrimary rounded-xl py-3 mt-2 "
                >
                    <Text className="text-center text-text font-semibold text-lg">
                        {loading ? "Loading..." : "Login"}
                    </Text>
                </Pressable>

                {/* Google 
                <Pressable className="bg-background dark:bg-darkBackground rounded-xl py-3 mt-4 border border-border dark:border-darkBorder">
                    <Text className="text-center text-text dark:text-darkText">
                        Login with Google(not done)
                    </Text>
                </Pressable> */}

                {/* Guest Login */}
                <Pressable
                    onPress={handleGuest}
                    className="bg-primary dark:dakrPrimary rounded-xl py-3 mt-4"
                >
                    <Text className="text-center text-text dark:text-darkText font-semibold text-lg">
                        Continue as Guest
                    </Text>
                </Pressable>
                {/* Register link */}
                <View className="flex-col text-center justify-center items-center mt-6">
                    <Text className="text-subtext dark:text-darkSubtext">
                        New here?
                    </Text>
                    <Link href={"/register" as any} asChild>
                        <Pressable>
                            <Text className="text-primary dark:text-darkPrimary font-semibold text-3xl mt-3">
                                Create Account
                            </Text>
                        </Pressable>
                    </Link>
                </View>
            </MotiView>
        </View>
    )
}