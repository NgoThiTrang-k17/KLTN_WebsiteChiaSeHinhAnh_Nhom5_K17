import React from 'react'

const Posts = ({posts}) => {
    return (
        <div>
            <center><h1>Post List</h1></center>
            {posts.map((post) => (
                <div class="card">
                    <div class="card-body">
                        <h3 class="post-id">{post.id}</h3> 
                        <h3 class="post-postTitle">{post.postTitle}</h3> 
                        <h6 class="post-imageName">{post.imageName}</h6> 
                        <h6 class="post-imagePath">{post.imagePath}</h6> 
                        <h6 class="post-ownerId">{post.ownerId}</h6> 
                        <h6 class="post-ownerName">{post.ownerName}</h6> 

                    </div>
                </div>
            ))}
        </div>
    )
};

export default Posts