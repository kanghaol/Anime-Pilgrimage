import React, {useState} from "react";
import {View, Text, TextInput, Pressable, Alert} from "react-native"
import {Link, router } from "expo-router"
import { MotiView} from "moti";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../hooks/useAuth"
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://192.168.0.152:5000/api"

export default function Register() {
    const { login }= useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidLength = password.length >= 6;

    const handleRegister = async () =>{
        if(!email || !password || !confirm || !name){
            return Alert.alert("Missing fields", "Fill out all information");
        }
        if (!isValidLength){
            return Alert.alert("Weak password", "Password must be at least 6 characters");
        }
        if(password !== confirm){
            return Alert.alert("Mismatch", "Passwords do not match");
        }
        setEmail(email.toLowerCase());
        try{
            setLoading(true);
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password, name}),
            });
            
            const data = await res.json();
            if (!res.ok){
                setLoading(false);
                return Alert.alert("Registration failed", data.message);
            }

            // migrate from guest to user
            const guest_token = await SecureStore.getItemAsync("guest_token");
            if(guest_token){
                const stored = await AsyncStorage.getItem(`guest_favorites_${guest_token}`);
                if(stored){
                    const favorites = JSON.parse(stored);

                    await fetch(`${API_BASE}/user/migrate-guest`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${data.token}`,
                        },
                        body: JSON.stringify({favorites}),
                    })
                    await AsyncStorage.removeItem(`guest_favorites_${guest_token}`);
                }
            }
            // save user token and delete guest token
            await login(data.token)
            router.replace("/(tabs)");
        }catch (err) {
            Alert.alert("Error", "Unable to register");
        } finally{
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background dark:bg-darkBackground px-6 justify-center">
            <MotiView
                from={{ opacity: 0, translateY: 20}}
                animate={{ opacity: 1, translateY: 0}}
                transition={{ type: "timing", duration: 500}}
            >
                <Text className="text-3xl items-center font-bold text-primary dark:text-darkPrimary mb-6">
                    Create Account
                </Text>
                <TextInput 
                    placeholder="Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    className="bg-gray-500 dark:bg-darkPrimary rounded-xl px-4 py-3 mb-4 text-text dark:text-darkText"                
                />
                <TextInput 
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    className="bg-gray-500 dark:bg-darkPrimary rounded-xl px-4 py-3 mb-4 text-text dark:text-darkText"
                />
                <TextInput 
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry 
                    value={password}
                    onChangeText={setPassword}
                    className="bg-gray-500 dark:bg-darkPrimary rounded-xl px-4 py-3 mb-4 text-text dark:text-darkText"
                />
                <TextInput 
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                    secureTextEntry 
                    value={confirm}
                    onChangeText={setConfirm}
                    className="bg-gray-500 dark:bg-darkPrimary rounded-xl px-4 py-3 mb-4 text-text dark:text-darkText"
                />

                <Pressable onPress={handleRegister} className="bg-primary rounded-xl py-3 mt-2">
                    <Text className="text-center text-text font-semibold text-lg">
                        {loading ? "Creating..." : "Register"}
                    </Text>
                </Pressable>
                <View className="flex-col justify-center items-center mt-6">
                    <Text className="text-subtext dark:text-darkSubtext">
                        Already have an account? 
                    </Text>
                    <Link href="/login" asChild>
                        <Pressable>
                            <Text className="text-primary dark:text-darkPrimary font-semibold mt-3 text-3xl">
                                Login
                            </Text>
                        </Pressable>
                    </Link>
                </View>
            </MotiView>
        </View>
    )
}