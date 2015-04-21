#version 330

in vec4 position;

uniform mat4 perspective_matrix;
uniform mat4 mouvement_matrix;
uniform mat4 transform_matrix;

out vec3 coord_texture;

void main () {
  coord_texture = vec3(position.x, position.y, position.z);
  gl_Position = perspective_matrix * mouvement_matrix * transform_matrix * position;
}
