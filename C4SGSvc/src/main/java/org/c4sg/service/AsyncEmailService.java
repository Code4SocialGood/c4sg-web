package org.c4sg.service;

import org.apache.commons.mail.EmailException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.Future;

@Service
public interface AsyncEmailService {
    void send(String from, String recipient, String subject, String text);
}
