package com.ll.blog.domain.email.service;

import com.ll.blog.domain.email.entity.EmailVerification;
import com.ll.blog.domain.email.repository.EmailVerificationRepository;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final EmailVerificationRepository emailVerificationRepository;

    @Value("${spring.sendgrid.api-key}")
    private String sendGridApiKey;

    @Value("${email.from}")
    private String fromEmail;

    // 인증코드 생성 (6자리 랜덤 숫자)
    public String generateCode() {
        Random random = new Random();
        int numberCode = random.nextInt(900000) + 100000; // 6자리 랜덤 숫자 생성
        return String.valueOf(numberCode);
    }

    // 인증 메일 요청 처리
    @Transactional
    public void sendVerificationEmail(String email) {
        String code = generateCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5); // 5분 후 만료

        // 기존 레코드가 있으면 가져오고, 없으면 새로 생성
        EmailVerification verification = emailVerificationRepository.findByEmail(email)
                .orElseGet(() -> EmailVerification.builder()
                        .email(email)
                        .build()
                );

        // 코드 & 만료시간 갱신
        verification.setCode(code);
        verification.setExpiryTime(expiryTime);

        // save: 새로 만든 경우 insert, 기존인 경우 update
        emailVerificationRepository.save(verification);

        // SendGrid로 이메일 전송
        try {
            sendEmail(email, code);
        } catch (IOException e) {
            throw new RuntimeException("이메일 전송에 실패했습니다.", e);
        }
    }

    // SendGrid를 사용한 이메일 전송
    private void sendEmail(String to, String code) throws IOException {
        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        String subject = "이메일 인증 코드";
        Content content = new Content("text/plain",
                "인증 코드: " + code + "\n\n5분 이내에 입력해주세요.");

        Mail mail = new Mail(from, subject, toEmail, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sg.api(request);

        if (response.getStatusCode() >= 400) {
            throw new IOException("SendGrid 이메일 전송 실패: " + response.getStatusCode());
        }
    }

    // 인증번호 검증
    @Transactional
    public boolean verifyCode(String email, String inputCode) {
        return emailVerificationRepository.findByEmail(email)
                .filter(v -> !v.isExpired()) // 유효기간 체크
                .filter(v -> v.getCode().equals(inputCode)) // 코드 일치 체크
                .map(v -> {
                    emailVerificationRepository.delete(v); // 인증 성공 시 삭제
                    return true;
                })
                .orElse(false); // 실패 조건
    }
}