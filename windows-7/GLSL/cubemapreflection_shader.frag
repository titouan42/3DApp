#version 330

in vec3 Normal;
in vec3 Position;

struct Camera {
    vec3 position;
    mat4 perspective_matrix;
    mat4 mouvement_matrix;
    mat4 normal_matrix;
    mat4 transform_matrix;
};

uniform Camera cam;

uniform samplerCube cube_texture;

out vec4 frag_color;

void main () {
  vec3 I = normalize(Position - cam.position);
  vec3 R = reflect(I, normalize(Normal));
  frag_color = texture(cube_texture, R);
}
