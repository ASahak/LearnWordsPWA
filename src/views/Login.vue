<template>
  <div>
    <NavigationHeader title="Login" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Welcome back</h1>
        <p>Sign in to continue</p>
      </div>
      <form>
        <font-awesome-icon icon="user" class="entry-icon" />
        <div class="input-container">
          <label>E-mail</label>
          <font-awesome-icon icon="at" class="input-icon" />
          <input type="email" placeholder="Type your email" />
        </div>
        <div class="input-container">
          <label>Password</label>
          <font-awesome-icon icon="lock" class="input-icon" />
          <input type="password" placeholder="Type your password" />
        </div>
        <input type="submit" value="Sign In" class="entry-btn" />
        <router-link to="/forgot-password" class="entry-links"
          >Forgot password?</router-link
        >
        <p class="dont-have-account">
          Don't have an account? &nbsp;
          <router-link to="/register" class="entry-links"> Sign Up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
<script>
import NavigationHeader from "@/shared/NavigationHeader";

export default {
  name: "login",
  components: {
    NavigationHeader,
  },
};
</script>
<style>
.entry-container {
  padding: 10px 30px;
}

.title-container {
  margin-top: 50px;
  margin-bottom: 50px;
  text-align: left;
}

.entry-btn {
  cursor: pointer;
  background: #24217c;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  min-width: 100px;
  transition: 0.2s;
  width: 100%;
}

.entry-btn:hover {
  background: #24217ccf;
}

.entry-icon {
  text-align: center;
  font-size: 50px;
  margin-bottom: 30px;
  font-weight: bold;
  color: #191675;
}

.dont-have-account {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 13px;
  color: #8c8989;
  line-height: 5px;
}

.entry-links {
  text-align: center;
  font-size: 13px;
  color: #8c8989;
  margin: 5px 0;
  display: inline-block;
}

.title-container p {
  font-size: 12px;
  color: #888484;
  margin: 0;
}

.title-container h1 {
  font-size: 30px;
  font-weight: bold;
  color: #191675;
  margin: 0;
}
</style>
