#version 330

in vec4 pos;
in vec4 normal;

struct Camera {
    mat4 perspective_matrix;
    mat4 mouvement_matrix;
    mat4 normal_matrix;
    mat4 transform_matrix;
};

uniform Camera cam;

out vec3 Normal;
out vec3 Position;

void main () {
  Normal = mat3(transpose(inverse(cam.transform_matrix))) * normal.xyz;
  Position = vec3(cam.transform_matrix * pos);
  gl_Position = cam.perspective_matrix * cam.mouvement_matrix * cam.transform_matrix * pos;
}
