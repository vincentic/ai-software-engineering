package cn.lim.todolistservice;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("cn.lim.todolistservice.mapper")
public class ToDoListServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ToDoListServiceApplication.class, args);
    }

}
