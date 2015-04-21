#version 330

in vec4 pos;
in vec4 normal;
in vec4 ambiant_color;
in vec4 diffuse_color;
in vec4 specular_color;

struct Light {
    mat4 position_light;
    vec4 ambiant_light;
    vec4 diffuse_light;
    vec4 specular_light;
    float intensity_light;
};
uniform Light light[1];

struct Camera {
    mat4 perspective_matrix;
    mat4 mouvement_matrix;
    mat4 normal_matrix;
    mat4 transform_matrix;
};
uniform Camera camera[1];

//Output fragment
out vec4 vertex_color;

void main()
{
   vec4 light_i = vec4(light[0].intensity_light, light[0].intensity_light, light[0].intensity_light, light[0].intensity_light);
   vec4 n = normalize(camera[0].transform_matrix * vec4(normal[0], normal[1], normal[2], 0.0));
   vec3 nlight = vec3(normalize(light[0].position_light * vec4(1.0, 1.0, 1.0, 1.0)));
   vec3 eye = vec3(normalize(camera[0].normal_matrix * n));
   vec3 spec_vect = vec3(normalize(light[0].position_light * camera[0].mouvement_matrix * vec4(1.0, 1.0, 1.0, 1.0)));
   float sf = pow(max(0.0, dot(eye, spec_vect)), 2.0);

   vec4 ambiant_res = mix(ambiant_color, light[0].ambiant_light, light_i);
   vec4 diffuse_res = mix(diffuse_color * max(0.0, dot(eye, normalize(nlight))), light[0].diffuse_light, light_i);
   vec4 specular_res = mix(specular_color * sf, light[0].specular_light, light_i);

   vertex_color = clamp(ambiant_res + diffuse_res + specular_res, vec4(0.0, 0.0, 0.0, 0.0), vec4(1.0, 1.0, 1.0, 1.0));
   gl_Position = camera[0].perspective_matrix * camera[0].mouvement_matrix * camera[0].transform_matrix * pos;
}
