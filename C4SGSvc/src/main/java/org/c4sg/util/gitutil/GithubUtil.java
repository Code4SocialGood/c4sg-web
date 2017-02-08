package org.c4sg.util.gitutil;

import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GithubUtil {

    private static final String githubUsername = "Code4SocialGood";
    private static final String githubReponame = "C4SG";


    public static List<Stat.Author> getContributorsByCommitsDesc() throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Stat[]> exchange = restTemplate.
                exchange("https://api.github.com/repos/"
                        + githubUsername + "/" + githubReponame + "/stats/contributors", HttpMethod.GET, null, Stat[].class);
        Stat[] stats = exchange.getBody();
        List<Stat.Author> contributors = new ArrayList<>(stats.length);
        for (Stat s : stats) {
            Stat.Author author = s.getAuthor();
            author.setCommits(s.getTotal());
            contributors.add(0, author);
        }
        return contributors;
    }

}
