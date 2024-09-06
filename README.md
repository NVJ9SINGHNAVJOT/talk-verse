# TalkVerse

TalkVerse is a social media web application.

## Note

- This project is created for learning purposes and can be used as a personal project.
- It **_can be deployed on a live server_** as **_all features_** all fully **_operational_**.

---

## Features

1. #### User Authentication :

   - TalkVerse ensures secure user registration and authentication using **JWT (JSON Web Tokens)**. Users can easily sign up, log in, and manage their profiles with confidence.
   - **Bcrypt** is used for password hashing, adding an extra layer of security to user data.

2. #### Application Stack :

   - The web application is built using TypeScript, React, Node.js, MongoDB, and PostgreSQL. These technologies form the foundation for its functionality and user interface.

3. #### Secure Chat with Encryption :

   - The chat feature incorporates both **asymmetric and symmetric encryption** methods. This ensures that user messages remain confidential and protected.

4. #### Real-Time Communication :

   - Websockets are employed to enable live chat functionality. Users can engage in real-time conversations, making the application dynamic and responsive.

5. #### Messaging Channels :

   - Channels organize message operations within the application.

6. #### Blogging and Post Creation :

   - Users have the ability to create and share blog posts or other content. This feature encourages engagement and content sharing.

## Installation

- Clone the repository to your local machine.
  ```
  git clone https://github.com/NVJ9SINGHNAVJOT/talk-verse.git
  ```
- Set up environment variables.
  In the root directory in /backend and /frontend **.env.example** file is present. Replace it with **.env** file and set the required variables running application _(.env.example contains all variables examples)_.
- Project can be run on local machine by Docker or by installing dependencies locally.
- **Using Docker**

  ```
  cd talk-verse
  cd backend
  docker compose up -d
  cd ..
  cd frontend
  docker compose up -d
  ```

- **Using local machine dependencies**

1. Install Node.js (if not already installed).
2. Install the required packages and start servers.
   ```
   cd talk-verse
   cd backend
   npm install
   npm run build
   npm run start
   cd ..
   cd frontend
   npm install
   npm run build
   npm run start
   ```

- Open the project in your browser at [`http://localhost:4173`](http://localhost:4173).

## Important

- PostgreSQL: Drizzle ORM is used for PostgreSQL. After any change in the schema, new SQL schemas need to be generated by Drizzle Kit by running the command **npm run postgresqldb:generate**. After this, restart the backend server.

---

## System Design

- [`Open`](https://raw.githubusercontent.com/NVJ9SINGHNAVJOT/pro-talk-verse/5e773fb5f7f09a6c318d26a5e18950076bddf48b/Talk-Verse-System-Design.svg?token=A46TLFB6OXTD7XXZSVUWYDDG3MP5O)
![Talk-Verse-System-Design](https://raw.githubusercontent.com/NVJ9SINGHNAVJOT/pro-talk-verse/5e773fb5f7f09a6c318d26a5e18950076bddf48b/Talk-Verse-System-Design.svg?token=A46TLFB6OXTD7XXZSVUWYDDG3MP5O)

---

## Screenshots

![homePage](https://github.com/user-attachments/assets/3c0e46a5-4c70-4a6e-a178-fb14836ccfa4)


<details>
  <summary>More screenshots</summary>

![signUpPage](https://github.com/user-attachments/assets/119dd678-4742-47bc-a265-037567a67333)
![about_us](https://github.com/user-attachments/assets/a69b9f29-eb4b-4ced-84e2-ea75cabe2082)
![contact_us](https://github.com/user-attachments/assets/6598e1b3-6eea-42be-b9da-047394987130)
![blogPage](https://github.com/user-attachments/assets/314c6756-ed25-482e-9aa8-0a8d836d4869)
![post_story](https://github.com/user-attachments/assets/81c0036a-0a3c-4790-9785-cd94fb18d46e)
![create_group](https://github.com/user-attachments/assets/b0727daf-196f-44f6-8064-164da71dc9f0)
![talk_page_2](https://github.com/user-attachments/assets/69c956dc-ef84-446f-b76e-4bc1007c80bf)
![talk_page_1](https://github.com/user-attachments/assets/903e8090-0246-405d-ac17-9501821065cf)
![search_2](https://github.com/user-attachments/assets/bac014f5-ee20-4aef-b3c2-107fdcd8900c)
![search_1](https://github.com/user-attachments/assets/de28c945-0da3-4e40-8963-cd5f1db340d7)
![profile](https://github.com/user-attachments/assets/a4360a27-49a8-4752-a70f-02e01a8fff12)
![saved_posts](https://github.com/user-attachments/assets/283186e4-9713-4c72-8684-99c3add3b8c9)
![private_key](https://github.com/user-attachments/assets/eeb59597-35a6-4812-a095-f5ebd855853b)
![post_review](https://github.com/user-attachments/assets/3a7827a9-0740-48c0-a840-be35c84b6386)
![loginPage](https://github.com/user-attachments/assets/f69df482-5576-45c6-a70d-4a3ed9b38738)
![followers](https://github.com/user-attachments/assets/234d8ab3-94bf-4ac4-b185-80769c6d5d15)
![skeleton](https://github.com/user-attachments/assets/9a059f74-fc57-48b3-9c8f-90dafa05fab3)


</details>
