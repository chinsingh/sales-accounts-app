<template>
  <section class="h-100">
    <div class="container h-100">
      <div class="row justify-content-sm-center h-100">
        <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
          <div class="text-center my-5">
            <img src="../assets/logo.png" alt="logo" width="100">
          </div>
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <h1 class="fs-4 card-title fw-bold mb-4">Register</h1>
              <form @submit.prevent="register" class="needs-validation"  autocomplete="off">

                <div class="mb-3">
                  <label class="mb-2 text-muted" for="email">E-Mail Address</label>
                  <input id="email" type="email" class="form-control" name="email" value="" required v-model="email">
                  <div class="invalid-feedback">
                    Email is invalid
                  </div>
                </div>

                <div class="mb-3">
                  <label class="mb-2 text-muted" for="password">Password</label>
                  <input id="password" type="password" class="form-control" name="password" required v-model="password">
                  <div class="invalid-feedback">
                    Password is required
                  </div>
                </div>

                <p class="form-text text-muted mb-3">
                  By registering you agree with our terms and condition (there are none).
                </p>

                <div class="align-items-center d-flex">
                  <button type="submit" class="btn btn-primary ms-auto" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Registering...' : 'Register' }}
                  </button>
                </div>
              </form>
            </div>
            <div class="card-footer py-3 border-0">
              <div class="text-center">
                Already have an account? <a href="login" class="text-dark">Login</a>
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

<script lang="ts">

import axios, { type AxiosResponse } from "axios";
import { type UserData } from '../models/user.model';
import apiConfig from '../../backend.config.json';

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      isSubmitting: false
    }
  },
  methods: {
    async register() {

      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      try {
        const registrationData: UserData = {
          email: this.email,
          password: this.password
        }

        const apiUrl = `${apiConfig.baseUrl}/api/v1/auth/register`;
        const response: AxiosResponse<any> = await axios.post(apiUrl, registrationData);
        this.$router.push('/login');

        alert('Registration successful! You can now login.');
      } catch (error:any) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + (error.message || 'Unknown error'));
      } finally {
        this.isSubmitting = false;
      }
    },

    validateForm() {
      let isValid = true;

      // Email validation
      if (!this.email || !this.validateEmail(this.email)) {
        document.getElementById('email')?.classList.add('is-invalid');
        isValid = false;
      } else {
        document.getElementById('email')?.classList.remove('is-invalid');
      }

      // Password validation
      if (!this.password) {
        document.getElementById('password')?.classList.add('is-invalid');
        isValid = false;
      } else {
        document.getElementById('password')?.classList.remove('is-invalid');
      }

      return isValid;
    },

    validateEmail(email: string) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
}
</script>
