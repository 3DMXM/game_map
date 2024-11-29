add_rules("mode.debug", "mode.release")

add_requires("inih") 
 
target("slice") 
    set_kind("binary") 
    add_files("src/*.cpp")
    set_languages("cxx20")
    add_packages("inih")
    -- 引入 C:\Users\xiaom\AppData\Local\Programs\opencv\opencv\build\include
    add_includedirs("C:/Users/xiaom/AppData/Local/Programs/opencv/opencv/build/include")
    -- 链入 C:\Users\xiaom\AppData\Local\Programs\opencv\opencv\build\x64\vc15\lib
    add_links("C:/Users/xiaom/AppData/Local/Programs/opencv/opencv/build/x64/vc16/lib/*.lib")
