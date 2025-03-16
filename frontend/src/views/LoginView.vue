<template>
  <section class="h-100">
    <div class="container h-100">
      <div class="row justify-content-sm-center h-100">
        <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
          <div class="text-center my-5">
            <img src="../assets/logo.png" alt="logo" width="100">
          </div>

          <!-- Login form -->
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <h1 class="fs-4 card-title fw-bold mb-4">Login</h1>
              <form @submit.prevent="login" class="needs-validation" autocomplete="off">
                <div class="mb-3">
                  <label class="mb-2 text-muted" for="email">E-Mail Address</label>
                  <input id="email" type="email" class="form-control" name="email" v-model="email" required autofocus>
                  <div class="invalid-feedback">
                    Email is invalid
                  </div>
                </div>

                <div class="mb-3">
                  <div class="mb-2 w-100">
                    <label class="text-muted" for="password">Password</label>
                  </div>
                  <input id="password" type="password" class="form-control" name="password" v-model="password" required>
                  <div class="invalid-feedback">
                    Password is required
                  </div>
                </div>

                <div class="d-flex align-items-center">
                  <button type="submit" class="btn btn-primary ms-auto" :disabled="isLoggingIn">
                    {{ isLoggingIn ? 'Logging in...' : 'Login' }}
                  </button>
                </div>
              </form>
            </div>
            <div class="card-footer py-3 border-0">
              <div class="text-center">
                Don't have an account? <a href="register" class="text-dark">Create one</a>
              </div>
            </div>
          </div>

          <div class="text-center mt-5 text-muted">
            Just a demo &mdash; Not an actual app.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios, { type AxiosResponse } from "axios";
import { type UserData } from '../models/user.model';
import apiConfig from '../../backend.config.json';

const router = useRouter();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoggingIn = ref(false);
const errorMessage = ref('');


const validateEmail = (email: string): boolean => {
  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return validEmailRegex.test(email);
};

const validateForm = (): boolean => {
  let isValid = true;

  if (!email.value || !validateEmail(email.value)) {
    document.getElementById('email')?.classList.add('is-invalid');
    isValid = false;
  } else {
    document.getElementById('email')?.classList.remove('is-invalid');
  }

  if (!password.value) {
    document.getElementById('password')?.classList.add('is-invalid');
    isValid = false;
  } else {
    document.getElementById('password')?.classList.remove('is-invalid');
  }

  return isValid;
};

const login = async (): Promise<void> => {
  if (!validateForm()) {
    return;
  }

  isLoggingIn.value = true;

  try {
    const loginData: UserData = {
      email: email.value,
      password: password.value
    };

    const apiUrl = `${apiConfig.baseUrl}/api/v1/user/login`;
    const response: AxiosResponse<any> = await axios.post(apiUrl, loginData, {
      withCredentials: true
    });

    router.push('/');
  } catch (error: any) {
    errorMessage.value = error.message || 'Invalid email or password';
    alert('Login failed: ' + errorMessage.value);
  } finally {
    isLoggingIn.value = false;
  }
};
</script>