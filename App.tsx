import {
  createDrawerNavigator,
} from "@react-navigation/drawer";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  useEffect,
} from "react";

import {
  BookListScreen,
} from "./src/books/BookListScreen";

import {
  AddBookScreen,
} from "./src/books/AddBookScreen";

import {
  DbSqliteService,
} from "./src/utills/DbSqliteService";

import { EditBookScreen } from "./src/books/EditBookScreen";
import { StyleSheet, } from "react-native";
const Drawer =
  createDrawerNavigator();


export default function App() {

  useEffect(() => {

    const createDatabase = async () => {

      try {

        const dbService =
          await DbSqliteService.getInstance();


        await dbService.createTable(
          "books",
          `
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          author TEXT NOT NULL
          `
        );

      } catch (error) {

        console.log(
          "Помилка при створенні БД:",
          error
        );

      }
    };


    createDatabase();

  }, []);


  return (
    <NavigationContainer>

      <Drawer.Navigator
        initialRouteName="Список книг"
      >

        <Drawer.Screen
          name="Список книг"
          component={BookListScreen}
        />

        <Drawer.Screen
          name="Добавить книгу"
          component={AddBookScreen}
        />
<Drawer.Screen
  name="Редагувати книгу"
  component={EditBookScreen}
  options={{
    drawerItemStyle: {
      display: "none",
    },
  }}
/>
      </Drawer.Navigator>

    </NavigationContainer>
  );
}
export const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    padding: 20, 
  }, 
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
  }, 
  input: { 
    height: 40, 
    borderColor: "#ccc", 
    borderWidth: 1, 
    marginBottom: 10, 
    paddingLeft: 8, 
    borderRadius: 5, 
  }, 
  bookItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ccc", 
    marginBottom: 10, 
  }, 
  bookTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
  }, 
  bookAuthor: { 
    fontSize: 16,
     color: "gray",
      marginBottom: 10, 
    }, 
    buttons: { 
      flexDirection: "row",
       gap: 10, 
      }, 
    });