#version 330

layout(location = 0) in vec4 pos;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec4 ambiant_color;
layout(location = 3) in vec4 diffuse_color;
uniform mat4 transform;

uniform mat4 light_pos;
uniform vec4 ambiant_light;
uniform vec4 diffuse_light;
uniform float intensity_light;

uniform mat4 perspective_matrix;
uniform mat4 mouvement_matrix;
uniform mat4 normal_matrix;

out vec4 vertex_color;

void main()
{
   vec4 n = normalize(transform * vec4(normal[0], normal[1], normal[2], 0.0));
   vec3 light = vec3(normalize(light_pos * vec4(1.0, 1.0, 1.0, 1.0)));
   vec3 eye = vec3(normalize(normal_matrix * n));
   vec4 light_i = vec4(intensity_light, intensity_light, intensity_light, intensity_light);

   vec4 ambiant_res = mix(ambiant_color, ambiant_light, light_i);
   vec4 diffuse_res = mix(diffuse_color * max(0.0, dot(eye, normalize(light))), diffuse_light, light_i);

   vertex_color = clamp(ambiant_res + diffuse_res, vec4(0.0, 0.0, 0.0, 0.0), vec4(1.0, 1.0, 1.0, 1.0));
   gl_Position = perspective_matrix * mouvement_matrix * transform * pos;
}
