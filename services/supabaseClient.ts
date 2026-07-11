import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants'; //reading key-value pairs (extra) from app.config.js
import 'react-native-url-polyfill/auto';


const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey= Constants.expoConfig?.extra?.supabaseAnonKey;

if(!supabaseUrl || !supabaseAnonKey){
    throw new Error("Missing Supabase config - check .env and app.config.js extra block");
}

export const supabase = createClient(supabaseUrl,supabaseAnonKey);

/*Why export const supabase and not a function — this is the singleton pattern your architecture blueprint calls for. Every other file that needs Supabase does import { supabase } from '@/services/supabaseClient' and gets the same client instance, rather than each file creating its own connection. */