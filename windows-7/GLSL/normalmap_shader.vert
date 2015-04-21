#version 330

in vec4 pos;
in vec4 normal;
in vec2 uv;

struct Camera {
    mat4 perspective_matrix;
    mat4 mouvement_matrix;
    mat4 normal_matrix;
    mat4 transform_matrix;
};
uniform Camera cam;

uniform int texture_repeat;

out vec3 eye_normal;
out vec3 vertex_pos;
out vec2 coord_texture;
out vec3 tangent;
out vec3 binormal;

void main(void)
{
    vec4 n = cam.transform_matrix * vec4(normal[0], normal[1], normal[2], 0.0);
    eye_normal = vec3(n);

    vec3 vertex_normal = vec3(normal[0], normal[1], normal[2]);
    vec3 c1 = cross(vertex_normal, vec3(0.0, 0.0, 1.0));
    vec3 c2 = cross(vertex_normal, vec3(0.0, 1.0, 0.0));
    tangent = normalize(length(c1) > length(c2) ? c1 : c2);
    binormal = normalize(cross(vertex_normal, tangent));

    coord_texture = uv * texture_repeat;

    vertex_pos = vec3(cam.transform_matrix * pos);
    gl_Position = cam.perspective_matrix * cam.mouvement_matrix * cam.transform_matrix * pos;
}
