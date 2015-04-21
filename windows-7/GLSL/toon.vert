#version 330

in vec4 pos;
in vec4 normal;

struct Camera {
    vec3 position;
    mat4 perspective_matrix;
    mat4 mouvement_matrix;
    mat4 normal_matrix;
    mat4 transform_matrix;
};
uniform Camera cam;

out vec3 eye_pos;
out vec3 eye_normal;
out vec3 vertex_pos;

void main(void)
{
    eye_pos = cam.position;
    vec4 n = cam.transform_matrix * vec4(normal[0], normal[1], normal[2], 0.0);
    eye_normal = vec3(n);

    vertex_pos = vec3(cam.transform_matrix * pos);
    gl_Position = cam.perspective_matrix * cam.mouvement_matrix * cam.transform_matrix * pos;
}
