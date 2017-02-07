package org.c4sg.util.gitutil;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Stat {

    private int total;
    private Author author;
    private Week[] weeks;

    public Week[] getWeeks() {
        return weeks;
    }

    public void setWeeks(Week[] weeks) {
        this.weeks = weeks;
    }


    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }


    public static class Week {
        private long w;
        private long a;
        private long d;
        private long c;

        public long getW() {
            return w;
        }

        public void setW(long w) {
            this.w = w;
        }

        public long getA() {
            return a;
        }

        public void setA(long a) {
            this.a = a;
        }

        public long getD() {
            return d;
        }

        public void setD(long d) {
            this.d = d;
        }

        public long getC() {
            return c;
        }

        public void setC(long c) {
            this.c = c;
        }
    }

    public static class Author {
        private String login;
        private long id;
        @JsonProperty(value = "avatar_url")
        private String avatarUrl;
        @JsonProperty(value = "gravatar_id")
        private String gravatarId;
        private String url;
        @JsonProperty(value = "html_url")
        private String htmlUrl;
        @JsonProperty(value = "followers_url")
        private String followersUrl;
        @JsonProperty(value = "following_url")
        private String followingUrl;
        @JsonProperty(value = "gists_url")
        private String gistsUrl;
        @JsonProperty(value = "starred_url")
        private String starredUrl;
        @JsonProperty(value = "subscriptions_url")
        private String subscriptionsUrl;
        @JsonProperty(value = "repos_url")
        private String reposUrl;
        @JsonProperty(value = "events_url")
        private String eventsUrl;
        @JsonProperty(value = "received_events_url")
        private String receivedEventsUrl;
        private String type;
        @JsonProperty(value = "site_admin")
        private boolean siteAdmin;
        @JsonIgnore
        private int commits;

        public int getCommits() {
            return commits;
        }

        public void setCommits(int commits) {
            this.commits = commits;
        }

        public String getLogin() {
            return login;
        }

        public void setLogin(String login) {
            this.login = login;
        }

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }

        public String getGravatarId() {
            return gravatarId;
        }

        public void setGravatarId(String gravatarId) {
            this.gravatarId = gravatarId;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getHtmlUrl() {
            return htmlUrl;
        }

        public void setHtmlUrl(String htmlUrl) {
            this.htmlUrl = htmlUrl;
        }

        public String getFollowersUrl() {
            return followersUrl;
        }

        public void setFollowersUrl(String followersUrl) {
            this.followersUrl = followersUrl;
        }

        public String getFollowingUrl() {
            return followingUrl;
        }

        public void setFollowingUrl(String followingUrl) {
            this.followingUrl = followingUrl;
        }

        public String getGistsUrl() {
            return gistsUrl;
        }

        public void setGistsUrl(String gistsUrl) {
            this.gistsUrl = gistsUrl;
        }

        public String getStarredUrl() {
            return starredUrl;
        }

        public void setStarredUrl(String starredUrl) {
            this.starredUrl = starredUrl;
        }

        public String getSubscriptionsUrl() {
            return subscriptionsUrl;
        }

        public void setSubscriptionsUrl(String subscriptionsUrl) {
            this.subscriptionsUrl = subscriptionsUrl;
        }

        public String getReposUrl() {
            return reposUrl;
        }

        public void setReposUrl(String reposUrl) {
            this.reposUrl = reposUrl;
        }

        public String getEventsUrl() {
            return eventsUrl;
        }

        public void setEventsUrl(String eventsUrl) {
            this.eventsUrl = eventsUrl;
        }

        public String getReceivedEventsUrl() {
            return receivedEventsUrl;
        }

        public void setReceivedEventsUrl(String receivedEventsUrl) {
            this.receivedEventsUrl = receivedEventsUrl;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public boolean isSiteAdmin() {
            return siteAdmin;
        }

        public void setSiteAdmin(boolean siteAdmin) {
            this.siteAdmin = siteAdmin;
        }
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}
