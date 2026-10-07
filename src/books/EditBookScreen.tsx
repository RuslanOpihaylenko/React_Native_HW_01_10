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
  IBook,
} from "../interfaces/IBook";

import {
  styles,
} from "../styles/book.styles";

import {
  DbSqliteService,
} from "../utills/DbSqliteService";


export const EditBookScreen = ({
  route,
  navigation,
}: any) => {

  const book: IBook =
    route.params.book;


  const [title, setTitle] =
    useState(book.title);

  const [author, setAuthor] =
    useState(book.author);


  const updateBook = async () => {

    if (
      !title.trim() ||
      !author.trim()
    ) {

      Alert.alert(
        "Помилка",
        "Введіть назву та автора"
      );

      return;
    }


    try {

      const dbService =
        await DbSqliteService.getInstance();


      await dbService.updateBook({
        id: book.id,
        title: title.trim(),
        author: author.trim(),
      });


      Alert.alert(
        "Успіх",
        "Книгу оновлено!"
      );


      navigation.goBack();

    } catch (error) {

      console.log(
        "Помилка при оновленні книги:",
        error
      );

      Alert.alert(
        "Помилка",
        "Не вдалося оновити книгу"
      );
    }
  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Редагувати книгу
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
        title="Зберегти зміни"
        onPress={updateBook}
      />

    </View>
  );
};
