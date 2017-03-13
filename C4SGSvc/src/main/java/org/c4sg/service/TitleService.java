package org.c4sg.service;

import java.util.List;

import org.c4sg.dto.TitleDTO;

public interface TitleService {

    List<TitleDTO> findTitles();
}
