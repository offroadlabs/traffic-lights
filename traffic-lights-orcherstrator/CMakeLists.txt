cmake_minimum_required(VERSION 3.20.0)

set(CONF_FILE "prj.conf")
set(BOARD qemu_x86)

enable_language(C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})
project(traffic-lights-orcherstrator)

target_compile_options(app PRIVATE $<$<COMPILE_LANGUAGE:CXX>:-fno-exceptions>)
target_compile_options(app PRIVATE $<$<COMPILE_LANGUAGE:CXX>:-fno-rtti>)
target_compile_options(app PRIVATE $<$<COMPILE_LANGUAGE:CXX>:-fno-threadsafe-statics>)

target_sources(app PRIVATE 
    src/main.cpp
    src/logger.cpp
    src/http_client.cpp
)

target_include_directories(app PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/src
)
