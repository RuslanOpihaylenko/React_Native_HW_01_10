import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import {
  useCallback,
  useState,
} from "react";

import {
  Alert,
  Button,
  FlatList,
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


export const BookListScreen = () => {

  const navigation =
    useNavigation<any>();


  const [books, setBooks] =
    useState<IBook[]>([]);


  const [searchText, setSearchText] =
    useState("");



  const loadBooks = async () => {

    try {

      const dbService =
        await DbSqliteService.getInstance();


      let result: IBook[];


      if (searchText.trim()) {

        result =
          await dbService.searchBooks(
            searchText
          );

      } else {

        result =
          await dbService.getBooks();

      }


      setBooks(result);

    } catch (error) {

      console.log(
        "Помилка при завантаженні книг:",
        error
      );

    }
  };

  useFocusEffect(
    useCallback(() => {

      loadBooks();

    }, [searchText])
  );



  const handleDeleteBook = (
    id: string
  ) => {

    Alert.alert(
      "Видалення книги",
      "Ви дійсно хочете видалити цю книгу?",

      [
        {
          text: "Скасувати",
          style: "cancel",
        },

        {
          text: "Видалити",
          style: "destructive",

          onPress: async () => {

            try {

              const dbService =
                await DbSqliteService.getInstance();


              await dbService.deleteBook(
                id
              );


              await loadBooks();

            } catch (error) {

              console.log(
                "Помилка при видаленні:",
                error
              );

            }
          },
        },
      ]
    );
  };


  const handleDeleteAllBooks = () => {

    if (books.length === 0) {

      Alert.alert(
        "Інформація",
        "У базі немає книг"
      );

      return;
    }


    Alert.alert(
      "Видалення всіх книг",
      "Ви дійсно хочете видалити всі книги?",

      [
        {
          text: "Скасувати",
          style: "cancel",
        },

        {
          text: "Видалити все",
          style: "destructive",

          onPress: async () => {

            try {

              const dbService =
                await DbSqliteService.getInstance();


              await dbService.deleteAllBooks();


              setBooks([]);


            } catch (error) {

              console.log(
                "Помилка при видаленні всіх книг:",
                error
              );

            }
          },
        },
      ]
    );
  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Список книг
      </Text>


      

      <TextInput
        style={styles.input}
        placeholder="Пошук за назвою або автором..."
        value={searchText}
        onChangeText={setSearchText}
      />


      

      <Button
        title="Видалити всі книги"
        onPress={handleDeleteAllBooks}
      />


  

      <FlatList
        data={books}

        keyExtractor={(item) =>
          item.id
        }

        ListEmptyComponent={
          <Text>
            Книги не знайдені
          </Text>
        }

        renderItem={({ item }) => (

          <View style={styles.bookItem}>

            <Text style={styles.bookTitle}>
              {item.title}
            </Text>

            <Text style={styles.bookAuthor}>
              Автор: {item.author}
            </Text>


            <View style={styles.buttons}>

              <Button
                title="Редагувати"
                onPress={() =>
                  navigation.navigate(
                    "Редагувати книгу",
                    {
                      book: item,
                    }
                  )
                }
              />


              <Button
                title="Видалити"
                onPress={() =>
                  handleDeleteBook(
                    item.id
                  )
                }
              />

            </View>

          </View>
        )}
      />

    </View>
  );
};
