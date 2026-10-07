import {
  useState,
} from "react";

import {
  Alert,
  Button,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  v4 as uuidv4,
} from "uuid";

import "react-native-get-random-values";

import {
  styles,
} from "../styles/book.styles";

import {
  DbSqliteService,
} from "../utills/DbSqliteService";


export const AddBookScreen = ({
  navigation,
}: any) => {

  const [title, setTitle] =
    useState("");

  const [author, setAuthor] =
    useState("");


  const saveBook = async () => {

    if (
      !title.trim() ||
      !author.trim()
    ) {

      Alert.alert(
        "Помилка",
        "Введіть назву та автора книги"
      );

      return;
    }


    try {

      const dbService =
        await DbSqliteService.getInstance();


      await dbService.addBook({
        id: uuidv4(),
        title: title.trim(),
        author: author.trim(),
      });


      setTitle("");
      setAuthor("");


      Alert.alert(
        "Успіх",
        "Книга додана!"
      );


      navigation.navigate(
        "Список книг"
      );

    } catch (error) {

      console.log(
        "Помилка при збереженні книги:",
        error
      );

      Alert.alert(
        "Помилка",
        "Не вдалося додати книгу"
      );
    }
  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Додати книгу
      </Text>


      <TextInput
        style={styles.input}
        placeholder="Назва книги"
        value={title}
        onChangeText={setTitle}
      />


      <TextInput
        style={styles.input}
        placeholder="Автор"
        value={author}
        onChangeText={setAuthor}
      />


      <Button
        title="Зберегти"
        onPress={saveBook}
      />

    </View>
  );
};
