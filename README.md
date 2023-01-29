# 🤖🖌️ [VizArt Computer Vision Drawing Platform](https://vizart.tech)
<br/>

Create and share your artwork with the world using VizArt - a simple yet powerful air drawing platform.

<br/>

<p align="center">
<img width="800" alt="image" src="https://user-images.githubusercontent.com/65676392/215330789-e38f2b41-1d7b-45b9-bb4f-09be3ffb9bf8.png">
</p>

## 💫 Inspiration
<br/>

> "Art is the signature of civilizations." - Beverly Sills 

<br/>

Art is a gateway to creative expression. With [VizArt](https://vizart.tech/create), we are pushing the boundaries of what's possible with computer vision and enabling a new level of artistic expression. ***We envision a world where people can interact with both the physical and digital realms in creative ways.***

We started by pushing the limits of what's possible with customizable deep learning, streaming media, and AR technologies. With VizArt, you can draw in art, interact with the real world digitally, and share your creations with your friends!

<br/>

> "Art is the reflection of life, and life is the reflection of art." - Unknow

<br/>

Air writing is made possible with hand gestures, such as a pen gesture to draw and an eraser gesture to erase lines. With VizArt, you can turn your ideas into reality by sketching in the air.

<p align="center">
<img width="400" alt="image" src="https://user-images.githubusercontent.com/65676392/215330736-0e670fe9-4b35-47f5-a948-a8cc107e78e1.png">
</p>

<p align="center">
<img width="400" alt="4" src="https://user-images.githubusercontent.com/65676392/215330565-568a319a-6175-434e-b2de-5017ea4853c5.png">
</p>

<p align="center">
<img width="400" alt="5" src="https://user-images.githubusercontent.com/65676392/215330572-36799049-dc33-430d-b59b-59ad50eb9e7a.png">
</p>

Our computer vision algorithm enables you to interact with the world using a color picker gesture and a snipping tool to manipulate real-world objects.

<p align="center">
<img width="400" src="https://user-images.githubusercontent.com/65676392/215331038-055999cb-85ad-4383-8373-f47d3534457d.png">
</p>

<br/>

> "Art is not what you see, but what you make others see." - Claude Monet

<br/>


The features I listed above are great! But what's the point of creating something if you can't share it with the world? That's why we've built a platform for you to showcase your art. You'll be able to record and share your drawings with friends.

<p align="center">
<img width="400" alt="image" src="https://user-images.githubusercontent.com/65676392/215331079-f676ea67-5e5c-4164-9c92-969919ef285b.png">
</p>

<p align="center">
<img width="400" alt="image" src="https://user-images.githubusercontent.com/65676392/215331103-10c5a04c-f4f8-48a1-b40c-a1ff06202ffa.png">
</p>


I hope you will enjoy using VizArt and share it with your friends. Remember: Make good gifts, Make good art.

# ❤️ Use Cases

### Drawing Competition/Game

VizArt can be used to host a fun and interactive drawing competition or game. Players can challenge each other to create the best masterpiece, using the computer vision features such as the color picker and eraser.

### Whiteboard Replacement

VizArt is a great alternative to traditional whiteboards. It can be used in classrooms and offices to present ideas, collaborate with others, and make annotations. Its computer vision features make drawing and erasing easier.

### People with Disabilities

VizArt enables people with disabilities to express their creativity. Its computer vision capabilities facilitate drawing, erasing, and annotating without the need for physical tools or contact.

### Strategy Games

VizArt can be used to create and play strategy games with friends. Players can draw their own boards and pieces, and then use the computer vision features to move them around the board. This allows for a more interactive and engaging experience than traditional board games.

### Remote Collaboration

With VizArt, teams can collaborate remotely and in real-time. The platform is equipped with features such as the color picker, eraser, and snipping tool, making it easy to interact with the environment. It also has a sharing platform where users can record and share their drawings with anyone. This makes VizArt a great tool for remote collaboration and creativity.

# 👋 Gestures Tutorial
<p align="center">
<img width="300" alt="image" src="https://user-images.githubusercontent.com/65676392/215335093-d911eaa1-0cc6-4e78-adc7-b63b323b2f74.png">
<img width="300" alt="image" src="https://user-images.githubusercontent.com/65676392/215335107-09c394a4-4811-4199-b692-74ef7377b23c.png">
<img width="300" alt="image" src="https://user-images.githubusercontent.com/65676392/215335122-8a517c4a-1374-42f0-ac71-6372a63a7075.png">
<img width="300" alt="image" src="https://user-images.githubusercontent.com/65676392/215335137-61a1bd8a-a95c-4e0d-806c-53c443dcdd9d.png">
<img width="300" alt="image" src="https://user-images.githubusercontent.com/65676392/215335143-93bc8edb-c2b2-4a8f-b562-d67b8524ac66.png">
</p>

# ⚒️ Engineering

Ah, this is where even more fun begins!

## Stack

### Frontend

We designed the frontend with Figma and after a few iterations, we had an initial design to begin working with. The frontend was made with React and Typescript and styled with Sass.

### Backend

We wrote the backend in Flask. To implement uploading videos along with their thumbnails we simply use a filesystem database.

## Computer Vision AI

We use MediaPipe to grab the coordinates of the joints and upload images. WIth the coordinates, we plot with CanvasRenderingContext2D on the canvas, where we use algorithms and vector calculations to determinate the gesture. Then, for image generation, we use the DeepAI open source library.

# Experimentation
We were using generative AI to generate images, however we ran out of time.

<p align="center">
<img width="800" alt="image" src="https://user-images.githubusercontent.com/65676392/215340713-9b4064a0-37ac-4760-bd35-e6a30c2f4613.png">
<img width="800" alt="image" src="https://user-images.githubusercontent.com/65676392/215340723-ee993e2b-70bb-4aa3-a009-ac4459f23f72.png">

</p>

# 👨‍💻 Team (”The Sprint Team”)

<p> @Sheheryar Pavaz </p>
<p> @Anton Otaner </p>
<p> @Jingxiang Mo </p>
<p> @Tommy He </p>

