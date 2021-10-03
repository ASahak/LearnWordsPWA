import {
  getAuth,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import * as firestore from "firebase/firestore";
// import { runTransaction } from "firebase/firestore";
import { createToast } from "mosha-vue-toastify";
// import { FirebaseAuthTypes } from '@react-native-firebase/auth';
// import firestore from "firebase/firestore";
// import auth from "firebase/auth";
// import { FiltersModel, WordModel } from '@core/models';
// import { Languages } from '@core/enums';

export default class Firebase {
  static getLoggedUser() {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });
  }

  static async logOut() {
    const auth = getAuth();
    return await signOut(auth);
  }

  static async registerUser({ email, password, username }) {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { getFirestore, doc, getDoc, setDoc } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(usersRef);
      if (!userSnap.exists()) {
        await setDoc(usersRef, {
          languages: ["en"],
          words: { en: [] },
          groups: { en: [] },
        });
        await updateProfile(auth.currentUser, {
          displayName: username,
        });
      }
      return { msg: "User registered!" };
    } catch (err) {
      return { error: err };
    }
  }

  static async loginUser({ email, password }) {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { displayName, uid } = userCredential?.user;
      return { displayName, uid };
    } catch (err) {
      createToast(err.message || err, {
        type: "danger",
        hideProgressBar: true,
      });
      return { error: err };
    }
  }

  static async passwordReset(email) {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      return { msg: "Check your email." };
    } catch (err) {
      return { error: err };
    }
  }

  static async getLanguages(userId) {
    try {
      const { getFirestore, doc, getDoc } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      const userSnap = await getDoc(usersRef);
      if (userSnap.exists()) {
        return {
          data: userSnap.data()?.languages,
        };
      } else {
        throw "No such document!";
      }
    } catch (err) {
      return { error: err };
    }
  }

  static async addLanguage({ userId, lang }) {
    try {
      const { getFirestore, doc, runTransaction } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      let langs = null;
      await runTransaction(db, async (t) => {
        const userSnap = await t.get(usersRef);
        if (userSnap.data()?.languages?.indexOf(lang) === -1) {
          const baseData = { ...userSnap.data() };
          baseData.languages.push(lang);
          baseData.words[lang] = [];
          await t.update(usersRef, baseData);
          langs = baseData.languages;
        }
      });
      return { data: langs };
    } catch (err) {
      return { error: err };
    }
  }

  // static async getList(userId, lang, filters) {
  //   try {
  //     const wordsData = await firebase
  //       .firestore()
  //       .collection("users")
  //       .doc(userId)
  //       .get();
  //     let words = wordsData.data()?.words?.[lang];
  //
  //     if (filters?.isGroupBy) {
  //       words = words.filter((e) => e.groupName === filters.filterBy);
  //     } else if (filters.filterBy === "learned") {
  //       words = words.filter((e) => e.isLearned);
  //     } else if (filters.filterBy === "not-learned") {
  //       words = words.filter((e) => !e.isLearned);
  //     } else if (filters.filterBy === "z-a") {
  //       words = words.sort((a, b) => {
  //         if (a[lang] > b[lang]) {
  //           return -1;
  //         }
  //         if (a[lang] < b[lang]) {
  //           return 1;
  //         }
  //         return 0;
  //       });
  //     } else if (filters.filterBy === "a-z") {
  //       words = words.sort((a, b) => {
  //         if (a[lang] < b[lang]) {
  //           return -1;
  //         }
  //         if (a[lang] > b[lang]) {
  //           return 1;
  //         }
  //         return 0;
  //       });
  //     } else if (filters.filterBy === "increase-date") {
  //       words = words.sort((a, b) => {
  //         if (a.publication < b.publication) {
  //           return -1;
  //         }
  //         if (a.publication > b.publication) {
  //           return 1;
  //         }
  //         return 0;
  //       });
  //     } else if (filters.filterBy === "decrease-date") {
  //       words = words.sort((a, b) => {
  //         if (a.publication > b.publication) {
  //           return -1;
  //         }
  //         if (a.publication < b.publication) {
  //           return 1;
  //         }
  //         return 0;
  //       });
  //     }
  //     if (filters.searchValue) {
  //       words = words.filter(
  //         (e) =>
  //           (e[lang] || "")
  //             .toLowerCase()
  //             .indexOf((filters.searchValue || "").toLowerCase()) > -1 ||
  //           (e.arm || "")
  //             .toLowerCase()
  //             .indexOf((filters.searchValue || "").toLowerCase()) > -1
  //       );
  //     }
  //     return { words };
  //   } catch (err) {
  //     return { error: err.message };
  //   }
  // }
  //
  static async checkExistingWord(lang, word1, userId) {
    try {
      const { getFirestore, doc, getDoc } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      const userSnap = await getDoc(usersRef);
      if (userSnap.exists()) {
        const wordsList = userSnap.data().words[lang] || [];
        if (wordsList.length) {
          if (wordsList.some((e) => e[lang] === word1)) {
            throw "This word already exist!";
          }
        }
      }
      return 1;
    } catch (err) {
      return { error: err };
    }
  }

  static async addGroup(lang, groupName, userId) {
    try {
      const { getFirestore, doc, runTransaction } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      await runTransaction(db, async (t) => {
        const userSnap = await t.get(usersRef);
        const baseData = { ...userSnap.data() };
        if (!baseData.groups[lang]) baseData.groups[lang] = [];
        if (baseData.groups[lang].indexOf(groupName) > -1) {
          throw "Group name already exist";
        }
        baseData.groups[lang].push(groupName);
        await t.update(usersRef, { groups: baseData.groups });
      });
      return { data: groupName };
    } catch (err) {
      return { error: err };
    }
  }

  static async getGroups(lng, userId) {
    try {
      const { getFirestore, doc, getDoc } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      const userSnap = await getDoc(usersRef);

      if (userSnap.exists()) {
        const userData = userSnap.data()?.groups;
        // eslint-disable-next-line no-prototype-builtins
        return { data: userData?.hasOwnProperty(lng) ? userData[lng] : [] };
      } else {
        throw "No such document!";
      }
    } catch (err) {
      return { error: err };
    }
  }
  //
  // static async updateWord(
  //   lang,
  //   word1,
  //   word2,
  //   userId,
  //   isLearned,
  //   publication,
  //   groupName
  // ) {
  //   try {
  //     const docRef = firebase.firestore().collection("users").doc(userId);
  //     return await firebase.firestore().runTransaction((transaction) => {
  //       return transaction.get(docRef).then((snapshot) => {
  //         const largerArray = snapshot.get("words");
  //         const itemIndex = largerArray?.[lang]?.findIndex(
  //           (e) => e.publication === publication
  //         );
  //         if (itemIndex > -1) {
  //           largerArray[lang][itemIndex] = {
  //             [lang]: word1,
  //             arm: word2,
  //             publication,
  //             isLearned,
  //             groupName: groupName || "",
  //           };
  //         }
  //         transaction.update(docRef, "words", largerArray);
  //       });
  //     });
  //   } catch (err) {
  //     return { error: err.message };
  //   }
  // }
  //
  // static async deleteWord(lang, userId, publication) {
  //   try {
  //     const docRef = firebase.firestore().collection("users").doc(userId);
  //     return await firebase.firestore().runTransaction((transaction) => {
  //       return transaction.get(docRef).then((snapshot) => {
  //         const largerArray = snapshot.get("words");
  //         const findIndex = largerArray[lang].findIndex(
  //           (e) => e.publication === publication
  //         );
  //         if (findIndex > -1) {
  //           largerArray[lang].splice(findIndex, 1);
  //           transaction.update(docRef, "words", largerArray);
  //         } else {
  //           throw "Can't find this word on cloud firestore";
  //         }
  //       });
  //     });
  //   } catch (err) {
  //     return { error: err.message };
  //   }
  // }
  //
  static async addWord(lang, word1, word2, userId, groupName) {
    try {
      const { getFirestore, doc, runTransaction } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      const addedData = {
        isLearned: false,
        publication: new Date().getTime(),
        [lang]: word1,
        groupName,
        arm: word2,
      };
      await runTransaction(db, async (t) => {
        const userSnap = await t.get(usersRef);
        const baseData = { ...userSnap.data() };
        if (!baseData.words[lang]) baseData.words[lang] = [];
        baseData.words[lang].push(addedData);
        await t.update(usersRef, { words: baseData.words });
      });
      return { data: addedData };
    } catch (err) {
      return { error: err };
    }
  }
}