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
import { LANG } from "@/utils/constants";

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
          language: LANG,
          languages: [LANG],
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

  static async getList(userId, lang) {
    try {
      const { getFirestore, doc, runTransaction } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      return await runTransaction(db, async (t) => {
        const userSnap = await t.get(usersRef);
        if (userSnap.exists()) {
          let words = userSnap.data().words[lang];
          return { words };
        } else throw "Document was not found!";
      });
    } catch (err) {
      return { error: err.message };
    }
  }

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

  static async updateWord({
    lang,
    word1,
    word2,
    userId,
    isLearned,
    publication,
    groupName,
  }) {
    try {
      const { getFirestore, doc, runTransaction } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      await runTransaction(db, async (t) => {
        const userSnap = await t.get(usersRef);
        if (userSnap.exists()) {
          const baseData = { ...userSnap.data() };

          const wordsData = baseData.words;
          const itemIndex = wordsData[lang].findIndex(
            (e) => e.publication === publication
          );
          if (itemIndex > -1) {
            wordsData[lang][itemIndex] = {
              [lang]: word1,
              arm: word2,
              publication,
              isLearned,
              groupName: groupName || "",
            };
            await t.update(usersRef, { words: wordsData });
          }
        }
      });
      return {};
    } catch (err) {
      return { error: err.message };
    }
  }

  static async deleteWord({ lang, userId, publication }) {
    try {
      const { getFirestore, doc, runTransaction } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      let wordsData;
      await runTransaction(db, async (t) => {
        const userSnap = await t.get(usersRef);
        if (userSnap.exists()) {
          const baseData = { ...userSnap.data() };

          wordsData = baseData.words;
          const itemIndex = wordsData[lang].findIndex(
            (e) => e.publication === publication
          );
          if (itemIndex > -1) {
            wordsData[lang].splice(itemIndex, 1);
            await t.update(usersRef, { words: wordsData });
          } else {
            throw "Can't find this word on cloud firestore";
          }
        }
      });
      return { data: wordsData[lang] };
    } catch (err) {
      return { error: err.message };
    }
  }

  static async changeLanguage(lang, userId) {
    try {
      const { getFirestore, doc, runTransaction } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      await runTransaction(db, async (t) => {
        const userSnap = await t.get(usersRef);
        if (userSnap.exists()) {
          await t.update(usersRef, { language: lang });
        } else throw "Can't find document";
      });
      return {};
    } catch (err) {
      return { error: err };
    }
  }

  static async getLanguage(userId) {
    try {
      const { getFirestore, doc, runTransaction } = firestore;
      const db = getFirestore();
      const usersRef = doc(db, "users", userId);
      return await runTransaction(db, async (t) => {
        const userSnap = await t.get(usersRef);
        if (userSnap.exists()) {
          return { data: userSnap.data().language };
        } else throw "Can't find document";
      });
    } catch (err) {
      return { error: err };
    }
  }

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
