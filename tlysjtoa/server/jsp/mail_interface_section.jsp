<%@ page language="java" import="java.util.*,com.fiberhome.bcs.appprocess.common.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<section id="mail_interface_section" data-cache="false" data-transition="slideUp">
	<header class="bar bar-nav">
		<a id="sendBtn" class="btn btn-link pull-right" href="#">
	    	<strong>发送</strong>
	    </a>
	    <a class="btn btn-link pull-left" data-target="back">取消</a>
	    <h1 class="title">发送邮件</h1>
	</header>
	
	<article class="active" data-scroll="true">
		<div class="scroller" style="height:50%;">
	        <form class="input-group">
	          <input type="text" id="to" placeholder="To:" value="<%=aa.req.getParameter("to")%>">
	          <input type="text" id="subject" placeholder="Subject:">
	          <textarea rows="20" id="content" placeholder="Content:"></textarea>
	        </form>
	    </div>
	</article>
</section>