plugins {
	java
	id("org.springframework.boot") version "3.4.6"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.ll"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("com.h2database:h2")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.postgresql:postgresql:42.7.2")
	implementation("io.jsonwebtoken:jjwt-api:0.11.5") // 	JWT 생성/파싱용 핵심 API
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5") //	내부 구현체 (필수)
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5") // 	JSON 변환용 (compact() 시에 필요함)
	implementation ("org.springframework.boot:spring-boot-starter-mail")
	implementation("com.sendgrid:sendgrid-java:4.9.3")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
