import React from 'react';
import { View, ScrollView } from 'react-native';
import ListProduct from './ListProduct';


export default function HomeScreen() {
    return (
        <>
            <ScrollView >
                <ListProduct></ListProduct>
            </ScrollView>
        </>

    );
}