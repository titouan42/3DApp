#version 330

layout(location = 0) in vec4 position;
layout(location = 1) in vec4 ambiant;

uniform mat4 perspective_matrix;
uniform mat4 mouvement_matrix;
uniform mat4 transform;

out vec4 vertex_color;

void main()
{
   gl_Position = perspective_matrix * mouvement_matrix * transform * position ;
   vertex_color = ambiant;
}
